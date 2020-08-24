# LN <-> tBTC swaps
> Low-cost trustless LN <-> tBTC swaps

## Features
- User-friendly: Works with all lightning and web3-enabled wallets
- Trustless: Based on submarine swaps, all transactions are atomic (if a party misbehaves the transaction is reverted)
- Low-cost: All contracts work under optimistic assumptions which reduce the cost if every party is honest
- Decentralized: Anyone can provide liquidity and the client will automatically pick the cheapest provider

## How it works
On a basic level, this protocol repurposes a feature of the lightning network, which was originally meant to prevent middlemen from stealing transactions that went through them, to enable atomnic swaps between on-chain tBTC and off-chain BTC, making it possible to pay a lightning invoice by sending tBTC on the ethereum network and viceversa. If you'd like to swap just go to [ln2tbtc.com](https://ln2tbtc.com).

To achieve this, the protocol relies on a marketplace of liquidity providers that run nodes that perform the swaps requested by users, charging fees for their services and freely competing between them to attract users with the lowest fees. If you'd like to become a liquidity provider and start earning fees check out the [How to become a liquidity provider section](#how-to-become-a-liquidity-provider).

Now let's dive deeper into the details of how everything works, starting first with the basic building block of this whole protocol: submarine swaps.

### A short primer on submarine swaps
When payments are made on the lightning network, it is quite common to have the sending and receiving nodes not be directly connected but instead be connected through a set of other nodes. That's not a problem, as the payment will be routed through them, updating all the channels along the path in a synchronized process that prevents anyone from cheating, but how does that exactly work?

Let's look at an example, Alice wants to send a payment to Bob through Eve, which runs a node that is connected to both of them. To make that payment, the channel between Alice and Eve will be updated to move X funds from Alice's side to Eve's and Bob's channel will also see a shift of X funds from Eve to Bob, thus resulting in a transfer from Alice to Bob. As you can see, these two movements need to be perfectly synchronized, as, if one happens without the other, someone will end up losing money. To prevent that from happening the parties involve will use the following protocol, which is based on the same principles used in atomic swaps:
1. Bob will generate a secret value `K` and send Alice `hash(K)` embedded into a lightning invoice
2. Alice will make a payment to Eve that can only be cashed out if Eve provides `K` before a timeout expires
3. Eve does the same with Bob
4. Bob reveals `K` in order the obtain the money on Eve's channel
5. As Bob has revealed his key, Eve can use it to also finalize Alice's payment
6. All payments are finalized and the transaction is completed

This protocol makes sure that money is moved atomically, either the chain is completed successfully and Bob reveals his key or none of the payments happen.

With that under our wing, let's dig into submarine swaps. These were invented to have a way to use on-chain BTC to pay lightning invoices, and they work by repurposing the `K` secret we encountered before to encumber on-chain transactions apart with off-chain ones. More concretely, they work in the following way:

Let's say that we have a scenario very similar to the one before, Alice wants to pay Bob but, this time around, Alice doesn't have any open payment channels at all, while Bob has one with Eve. Alice would pay with the following steps:
1. Bob generates `K` and gives `hash(K)` to Alice
2. Alice sends an on-chain transaction to Eve that can only be spent if `K` is revealed within one hour, otherwise Alice can just claim back that transaction
3. Eve sends an off-chain payment to Bob that is also encumbered by `K`
4. Bob reveals `K` to receive the money
5. Eve claims the transaction from step 2

At the moment, submarine swaps are mostly used to refill lightning channels that have unbalanced capacity, but we can take that idea and spin it into it's own protocol for cross-chain trading.

### Rebuilding the submarine
Adapting submarine swaps to make the on-chain transaction be in the ETH network instead of in the BTC one should come quite naturally in the case of swapping tBTC for BTC, as, on the conceptual level, nothing needs to be changed.

But when it comes to the reverse process, swapping a lightning payment for on-chain tBTC, things get a little bit more complicated. Here's the protocol for these swaps:
1. Client generates a secret `K` and sends `hash(K)` it to the chosen node
2. The node generates a lightning invoice that has `hash(K)` as it's HLTC
3. Client checks that the invoice effectively uses `hash(K)` and pays it
4. Node sends a tBTC payment to the user conditioned on the revealing of `K` within a timeframe
5. Client reveals `K` to claim the tBTC locked in the last step
6. Node reveals `K` and finalises lightning payment

If implemented just like this, this protocol would have a big downside: it would be possible for clients to grief nodes by starting payments and then never revealing `K`, as in those cases nodes would have to pay for several on-chain ETH transactions while the user would only need to do LN payments, which should be free due to the fact that none of these would be finalised. This problem can be solved by making the user provide a security deposit in ETH when a new request is created. This deposit will be returned if the user provides `K` on time but, if that's not the case, it will just be given to the node operator as compensation.

TODO: ADD IMAGES

### Adding optimism: making our protocol half-full
TODO

### A note on user griefing
While the current protocol protects nodes from any kind of griefing (transactions that end up being wasted) from users, that property doesn't hold in the other direction, as it's possible for nodes to act maliciously and make users send transactions that will need to be reverted later, causing them to lose some money on fees and lock their funds temporarily. This behaviour is completely irrational, nodes wouldn't be earning any money from doing this, instead they'd actually be losing some by running a node, but it's entirely possible that someone still does it so it's important to consider it.

At the moment, I've thought of a few mechanisms that would prevent or punish that behaviour:
- Make nodes lock some ETH as a security deposit that will be forfeited if a valid proof of misbehaviour is provided. This would be perfect, but validating a proof of LN payment on a smart contract would increase it's complexity a lot and it would be quite hard to implement. Furthermore, it's quite likely that users would need to use special software to generate this kind of proofs (or do something hacky such as running a LN node in the dApp) so UX would also be harmed.
- Implement some kind of reputation system that would be used when deciding which node to use for a swap. The problem with this would be making it hard to game, something that has proved to be an unsolved problem, especially in weak identity environments such as blockchain in general.
- Use a whitelist. This would solve all the other problems but it would make the whole system centralized (it would still be trustless tho).

Generally I don't like any of these solutions, so, for the time being, I won't implement any of them. Instead I'll see how this project evolves and defer my decisions to a later date. If you, the reader, know of a different solution, please let me know.

## How to become a liquidity provider
TODO

## Development
```bash
npm install # Install dependencies
npm start # Run development server
```

## Alternatives
### Full-L2 swaps
Initially I started this project with the idea of doing L2-to-L2 conversions between the ETH and BTC chains, but, while on the technical level this would be pretty simple to do by just bridging HTLCs between chains, I quickly realized that payment channels are rarely used in Ethereum and having a single channel between the user and a liquidity provider would only make it possible to trade back and forth tBTC for BTC, which doesn't make much sense as I imagine that if you want to exchange your BTC for tBTC it's because you want to use it in a smart contract.

In other words, I don't believe that holding tBTC inside a payment channel on the ETH network is interesting to anyone because of the following reasons:
- Payment channels in ETH aren't commonly used so you'd have trouble finding somebody else to send these tokens on L2
- If you just want to use BTC as a payment method it would be better to just keep it on the BTC chain, as the infraestructure there is more focused on that use case
- tBTC users are probably interested in using it on smart contracts, and doing so requires your tokens not to be locked inside payment channels

Because of these reasons I eventually abandoned the idea and focused instead on ETH<->LN swaps.

### Atomic swaps
Building a service based on atomic swaps, which would enable swaps of on-chain BTC with on-chain tBTC, is certainly doable, however, I believe that it wouldn't add much value due to the following reasons:
- This functionality is already available through normal tBTC redemtion and deposit (atomic swaps may be cheaper tho)
- There's already several exchanges that enable erc20 <-> BTC atomic swaps
  - Building a different one would just split the available liquidity
  - I'd end up building a copy of something else, which would probably be worse since these exchanges have been iterating on their products for years
  - This wouldn't add much to the ecosystems, as this a problem that has already been solved
- The kind of transactions required for atomic swaps are not supported by most common BTC wallets, so user experience is worse. I wanted this service to be extremely easy to use for users.

### Centralized swaps
It would be possible to build a centralized system that just receives tBTC on an address and sends on/off-chain bitcoin to some other address, essentially a copy of all these swapping services such as changelly or changenow. That would be completely centralized, but it would provide some extra benefits:
- It would be directly usable for users that have wallets that are not web3-enabled (wallets that only let you send eth/erc20, also see the ['Protocol for send-only wallets' section in Appendix](#protocol-for-send-only-wallets))
- It's easier to use than all the other alternatives (only requires sending money to an address)
- It would be a little bit more private as all the parameters of the swaps wouldn't need to be logged on a public smart contract

On the other side, it would be completely centralized, trust-full and wouldn't allow diverse parties to compete for the lowest fees.

With that said, users would only need to trust it during the short period of time when a transaction is being processed, and I'd make the server provide a signed message specifying all the parameters of the request, which would serve as a fraud proof if the service ever behaved incorrectly (see the ['Fraud proof protocol' section in Appendix](#fraud-proof-protocol)). With this, it would only be possible for the service to cheat at a single point in time.

In any case, due to the large usage that these kind of services have experienced along with the extremely low probability of one of them integrating tBTC I wuld be down to build one an integrate it into this product if the community likes the idea.

## Acknowledgments
None of the ideas exposed here are novel, submarine swaps have existed since 2018 and the possibility of using them to do cross-chain swaps has been discussed multiple times, the only thing slightly innovative about this protocol is the LN -> on-chain swap, which still relies heavily on the ideas behind submarine swaps.  
Furthermore, using optimistic assumptions in smart contracts to reduce gas cost is also something really common in the ethereum community, so all the merit for these belongs to their inventors, not me.

All I did was put them together, analyse the result and implement it.

## Similar work
To the best of my knowledge there has been two other projects that have implemented one-way submarine swaps between LN and the Ethereum network: [leon-do/submarine-swaps](https://github.com/leon-do/submarine-swaps) and [Jasonhcwong/lnswaps](https://github.com/Jasonhcwong/lnswaps). However, both of these projects are protoypes and they have huge security holes (one of them has a griefing problem that makes it possible to make the node spend all its ETH by simply sending requests to it and the other has a reentrancy bug that makes it possible to steal all the funds in the contract), so I believe they are not mature enough.

----

## Appendix
### Protocol for send-only wallets
It may be possible to support these wallets by making them send ETH to an empty address, in which a contract will be directly deployed with those same funds. This protocol would follow the following steps:
1. Generate the code of a smart contract that implements submarine swaps
2. Hash that code to obtain an address, which would be provided to the user
3. User would send funds to that address
4. Some other party deploys the code generated by the dApp on step 1 to that same address using CREATE2
5. Upon deployment, the contract would pay the entity that created it by refunding it's gas costs (and maybe adding some more eth as an incentive?)
6. Contract is ready

The problem of this protocol is that it has a high complexity (-> high chance of bugs) so, at the moment, I don't plan to implement anything like this.

### Fraud proof protocol
This fraud proof system would work in the following way:
1. User requests a swap, providing the address/receipt where they want their funds to be sent
2. Server sends a signed response that includes:
	- Time
	- Address/receipt where the user wants their funds
	- Address/receipt where the server wants to receive the funds from the user
3. User sends the funds
4. If the server hasn't complied with the request and sent the funds to the user, the user can then make public the signed request from step 2, along with a proof that the payment from user to server was done correctly and on time (proof would be either an on-chain tx or the HTLC pre-image used in the LN payment).
5. If the server behaved properly it can then produce a proof of payment to the user, thus nullifying the user's claims. Note that if the user was meant to be paid through a lightning channel but their node was offline or refused to accept the transaction then it wouldn't be possible for the server to pay nor obtain a proof of payment. In these cases a solution would be for the server to fallback to an on-chain id or refund the user on the original chain, as both events would allow for the creation of proof of payment.
6. Anyone can directly verify the claims of both server and user to determine if there has been misbehaviour.
7. If the server is found to have misbehaved all trust on it will be revoked by the community, therefore it won't be able to cheat again.

Now, you might think that, given that these proofs allow anyone to check for misbehaviour, it would be possible to build a smart contract based on them that provide some sort of protection to the user while incentivizing the service operator to behave correctly. For example, we could build a smart contract where the service operator locks 100.000$ in ETH and anyone can submit a fraud proof, then, if the submitted fraud proof is not successfully contested by the operator after some time, the locked money is slashed and distributed among the users that have been wronged by the operator.

As long as the amount of money locked in that contract is always superior to the volume of the service, such punishment-based system would actually make the whole service trustless as it would be impossible for the user to lose money.   However, such system is vulnerable to a critical attack (apart from having to maintain the #volume assumption): Let's say a honest user creates a transaction trading 10k and then the operator posing as a user creates another one of 990k, afterwards the operator fails to honor both, resulting in two successful fraud proofs being submitted and succeeding, but now there's only 100k to cover 1000k in transactions so, given that there's no way to know which transactions are honest and which aren't, the expected value of the refund received by the user is 1k regardless of teh strategy used to allocate the funds (given any strategy the operator can arrange their transactions to maximize profit on it), thus incurring a 90% loss.

Note that this attack can be fixed (that's actually one of the attacks that tBTC has been made resistent against) but doing so would require smart contract interactions and that completely destroys the point of doing centralized swaps (why use them if the user experience is the same as with the trustless approach, the latter is then strictly superior).
