// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LN2tBTC.sol";

contract TestLN2tBTC {

  function testAddFees() public {
    LN2tBTC swapContract = LN2tBTC(DeployedAddresses.LN2tBTC());

    Assert.equal(swapContract.addFees(10**9, 10**4, 10**5), 1000200000, "addFees computes fees correctly");
  }

  function testFeeMethods() public {
    LN2tBTC swapContract = LN2tBTC(DeployedAddresses.LN2tBTC());
    uint linearFee = 10**4;
    uint constantFee = 10**5;
    uint initial = 10**6;
    uint withFees = swapContract.addFees(initial, linearFee, constantFee);
    uint withoutFees = swapContract.removeFees(withFees, linearFee, constantFee);
    Assert.equal(withoutFees, initial, "fee methods are not reversible between them");
  }

/*
  function testInitialBalanceUsingDeployedContract() public {
    MetaCoin meta = MetaCoin(DeployedAddresses.MetaCoin());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }

  function testInitialBalanceWithNewMetaCoin() public {
    MetaCoin meta = new MetaCoin();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  }
*/
}
