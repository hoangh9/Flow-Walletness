// Basic Transfer

import Web3Loyalty from 0x01
import NonFungibleToken from 0x02

/// Basic transaction for two accounts to authorize
/// to transfer an NFT

transaction (recipient:Address) {
    prepare(acct:AuthAccount) {
        let nftMinter = acct.borrow<&Web3Loyalty.Minter>(from: /storage/Minter)!
        let publicReference = getAccount(recipient).getCapability(/public/Collection)
                                .borrow<&Web3Loyalty.Collection{NonFungibleToken.CollectionPublic}>()
                                ?? panic("This account does not have Collection")

         publicReference.deposit(token: <- nftMinter.createNFT(vouncher_name: "Starbuck", brand_code: "STB", vouncher_code: "XNBAJ15",expired_date: 12042023,discount_per: 15,tokenURI: "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/20"))
}

    execute {
        log("Stored a Collection for Web3Loyalty")
    }
}
