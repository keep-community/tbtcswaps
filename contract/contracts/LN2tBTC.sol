//
//                 ,/
//               ,'/
//             ,' /
//           ,'  /_____,
//         .'____    ,'
//              /  ,'
//             / ,'
//            /,'
//           /'
//
// Ascii art made by Evan M Corcoran
//
// A full explanation of the protocol can be found at https://github.com/corollari/ln2tBTC/blob/master/README.md

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// We are not using SafeMath because none of the operations on the contract can result in an overflow/underflow
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LN2tBTC {

	// ---------------------------------------------------------------
	// OPERATORS
	// ---------------------------------------------------------------

	// All of this information could be stored off-chain, but then we would need a way for users to discover the operators available.
	// To achieve that we would need to build a decentralized and uncensorable list of operators, which would be really hard,
	// as the operators are incentivized to prevent users from finding out about other operators.
	// It would also be possible to store only a few bits on-chain and the rest off-chain, but given that this is only a one-time cost for operators,
	// the cost difference is negligible and doing that would probably harm user UX, I believe it's best to store this info on-chain.
	// Moving this info off-chain may be re-evaluated in the future tho, as it would allow for things such as custom algorithms for setting the fees
	struct Operator {
		// Balance in tBTC (held in the contract to prevent operators from providing fake data).
		// It may seem like holding all the balance in the contract increases the risks for the operators, as if the contract gets hacked
		// they would lose all the funds they have parked there instead of only the funds currently being used in trades.
		// However, if a hacker found an exploit they could make operators put all their money in swap operations (by starting swaps),
		// so there's no real difference in risk (operators are also free to only keep the amount currently used in swaps in the contract).
		// On the other side, this makes it much harder for operators to grief users, so that's a good thign to have while
		// a better anti-user-griefing system is developed (see the section on griefing on README.md for more info).
		uint tBTCBalance;
		// Balance in BTC held by the operator on the Lightning network
		// There's no verification performed on this data point
		// Even if we built a proof system that checked this we would have trouble
		// dealing with the unknown capacity limitation on the LN channels that connect user and operator
		uint lnBalance;
		// Just a simple bool that will be used to check if an item already exists in a mapping
		// Will always be set to true on creation
		bool exists;
		// A fee imposed by the provider that increases linearly with the value of the swap
		// It will be multiplied by the swapped amount and divided by 10^8 to obtain the fee that will be charged to the user
		uint linearFee;
		// A constant fee charged by the provider that will just be added to the value requested
		uint constantFee;
		// totalFee = (amount*linearFee)/10^8 + constantFee
	}

	// Contains all operator info addressed by operator address
	// Used by users in conjuction with `operatorList` to search for operators
	mapping (address => Operator) public operators;
	// List of operators, used by users to find the best operator for a swap
	address[] public operatorList;
	// ERC20 tBTC contract (vending machine)
	IERC20 tBTContract = IERC20(0x179eabC663E7d282eF1d25bfcBdA19e5d210E7D7);

	// Register a new operator
	// Must only be called once by the operator itself when it starts operating
	// Requires a previous approve() call to the ERC20 tBTC contract to allow the token transfer
	function operatorRegister(uint tBTCBalance, uint lnBalance, uint linearFee, uint constantFee) public {
		require(operators[msg.sender].exists==false, "Operator has already been registered before");
		operators[msg.sender] = Operator(tBTCBalance, lnBalance, true, linearFee, constantFee);
		tBTContract.transferFrom(msg.sender, address(this), tBTCBalance);
		operatorList.push(msg.sender);
	}

	// Simple withdraw operation for the ERC20 tBTC tokens held in the contract in behalf of an operator
	function operatorWithdrawTBTC(uint amount) public returns(bool){
		Operator storage op = operators[msg.sender];
		require(op.tBTCBalance >= amount);
		op.tBTCBalance -= amount;
		tBTContract.transfer(msg.sender, amount);
		return true;
	}

	// Simple deposit operation
	// Requires a previous approve() call to the ERC20 tBTC contract to allow the token transfer
	function operatorDepositTBTC(uint amount) public returns(bool){
		Operator storage op = operators[msg.sender];
		require(op.exists == true); // Not needed, just there to make sure people don't lose money
		op.tBTCBalance += amount;
		tBTContract.transferFrom(msg.sender, address(this), amount);
		return true;
	}

	// Set the fees of the operator calling the function
	function operatorSetFees(uint newLinearFee, uint newConstantFee) public {
		operators[msg.sender].linearFee = newLinearFee;
		operators[msg.sender].constantFee = newConstantFee;
	}

	// Set the amount of LN-bound BTC that the operator makes available
	// This number is completely unverified and can be faked
	function operatorSetLNBalance(uint newLNBalance) public {
		operators[msg.sender].lnBalance = newLNBalance;
	}

	// ---------------------------------------------------------------
	// tBTC -> LN SWAPS
	// ---------------------------------------------------------------
	// TODO: Move some steps off-chain to lower the cost and make the whole process faster (no need to wait for confirmations)
	// This is harder that it seems because you have to avoid impersonation attacks from other users
	// (eg: A locks tBTC and B sends to the operator an invoice that pays to B, the operator won't be able to tell which invoice is the right one: A's or B's)
	// To prevent these attacks, an authentication system must be put in place, but the obvious solutions all have downsides:
	//   - Signing the message with metamask requires an additional step for the user -> worse UX
	//   - Creating an ephemeral key in the browser can cause problems if the history is deleted mid-swap and it involves extra data (pubkey) sent on txs
	// So I'm still unsure on what's the best solution for this.

	// Time it takes for a step of the swap to time out if the counter-party is unresponsive
	// Constant chosen arbitrarily
	uint public timeoutPeriod = 1 hours;

	struct TBTC2LNSwap {
		// User that has created this swap
		// This field is also used to check for struct existence by comparing it against address(0)
		address user;
		// Provider that is serving the swap
		address provider;
		// Amount of tBTC that is locked in the swap
		uint tBTCAmount;
		// Hash that will be used in the HTLC of the LN invoice
		// It's preimage will be required to unlock the tBTC (unless the swap is reverted due to a timeout)
		bytes32 paymentHash;
		// Timestamp of the moment the swap was created.
		// Always set to `now` on creation
		uint startTimestamp;
	}

	// A double mapping is used for the following reasons:
	//   - It splits the storage spaces of different users, preventing attacks where one user can front-run another user's txs to prevent them from creating a swap
	//   - The space of each user is indexed using a unique identifier, in this case the paymentHash (which must be unique, otherwise it's pre-image may be public)
	// This allows a user to have multiple swaps running concurrently while preventing attacks
	mapping (address => mapping (bytes32 => TBTC2LNSwap)) public tbtcSwaps;

	// Event fired when a new tBTC->LN swap process has been started
	event TBTC2LNSwapCreated(bytes32 paymentHash, uint amount, address userAddress, address providerAddress, string invoice);

	// TODO: Send LN invoice to operator through an off-chain medium to lower costs (not by much tho)
	// Create a new swap from tBTC to LN, locking the tBTC tokens required from the swap in the contract
	// Requires a previous approve() call to the ERC20 tBTC contract to allow the token transfer
	function createTBTC2LNSwap(bytes32 paymentHash, uint amount, address providerAddress, string memory invoice) public {
		require(tbtcSwaps[msg.sender][paymentHash].user==address(0), "Swap already exists");
		tbtcSwaps[msg.sender][paymentHash] = TBTC2LNSwap(msg.sender, providerAddress, amount, paymentHash, now);
		tBTContract.transferFrom(msg.sender, address(this), amount);
		emit TBTC2LNSwapCreated(paymentHash, amount, msg.sender, providerAddress, invoice);
	}

	// Reverts a swap, returning the locked tBTC tokens to the user, if the pre-image hasn't been revealed within 1 hour of swap creation
	// This could happen because either the operator is unresponsive and hasn't paid the invoice on time
	// or because the user hasn't revealed the pre-image before the timeout
	// (it could also happen if the operator malfunctions and doesn't claim it's payment after the swap, but this should never happen)
	function revertTBTC2LNSwap(bytes32 paymentHash) public {
		TBTC2LNSwap storage swap = tbtcSwaps[msg.sender][paymentHash];
		require(swap.user!=address(0), "Swap doesn't exist");
		require(swap.tBTCAmount > 0, "Swap has already been finalized");
		require((swap.startTimestamp + timeoutPeriod) > now, "Swap hasn't timed out yet");
		uint tBTCAmount = swap.tBTCAmount;
		swap.tBTCAmount = 0;
		tBTContract.transfer(msg.sender, tBTCAmount);
	}

	// Finalizes a successful swap by transferring the locked tBTC tokens to the operator
	// This is called by the swap operator and requires the preimage of the HTLC used in the lightning invoice,
	// which is revealed when the invoice is accepted by the user's wallet/node
	function operatorClaimPayment(address userAddress, bytes32 paymentHash, bytes memory preimage) public {
		TBTC2LNSwap storage swap = tbtcSwaps[userAddress][paymentHash];
		require(swap.provider != msg.sender, "Swap doesn't use this provider or doesn't exist at all");
		require(swap.tBTCAmount > 0, "Swap has already been finalized");
		require(sha256(preimage) == paymentHash, "Preimage doesn't match the payment hash");
		operators[msg.sender].tBTCBalance += swap.tBTCAmount;
		swap.tBTCAmount = 0;
		operators[msg.sender].lnBalance -= swap.tBTCAmount;
	}

	// ---------------------------------------------------------------
	// LN -> tBTC SWAPS
	// ---------------------------------------------------------------

	uint public securityDepositAmount = 1 ether;

	struct LN2TBTCSwap {
		// User that has created this swap
		// This field is also used to check for struct existence by comparing it against address(0)
		address user;
		// Provider that is serving the swap
		address provider;
		// Amount of tBTC that is locked in the swap
		uint tBTCAmount;
		// Hash that will be used in the HTLC of the LN invoice
		// It's preimage will be required to unlock the tBTC (unless the swap is reverted due to a timeout)
		bytes32 paymentHash;
		// Timestamp of the moment the swap was created.
		// Always set to `now` on creation
		uint startTimestamp;
	}

	event LN2TBTCSwapCreated();
	event LN2TBTCInvoiceUploaded(string invoice);

	function createLN2TBTCSwap() payable public {
		require(msg.value == securityDepositAmount, "ETH security deposit provided isn't the right amount (1 ETH)");
	}

	// TODO: Move this off-chain
	function operatorUploadInvoice(string memory invoice, address userAddress, bytes32 paymentHash) public {
		emit LN2TBTCInvoiceUploaded(invoice);
	}
}
