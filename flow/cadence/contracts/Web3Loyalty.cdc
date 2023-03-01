import NonFungibleToken from 0x02
pub contract Web3Loyalty: NonFungibleToken {
  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub let vouncher_name: String
    pub let brand_code: String
    pub let vouncher_code: String
    pub let expired_date: UInt64
    pub let discount_per: Int
    pub let tokenURI: String

    init(_vouncher_name: String, _brand_code: String, _vouncher_code: String,_expired_date: UInt64,_discount_per: Int,_tokenURI: String) {
      self.id = Web3Loyalty.totalSupply
      Web3Loyalty.totalSupply=Web3Loyalty.totalSupply + 1
      self.vouncher_name = _vouncher_name
      self.brand_code = _brand_code
      self.vouncher_code = _vouncher_code
      self.expired_date = _expired_date
      self.discount_per = _discount_per
      self.tokenURI = _tokenURI
    }
  }

pub resource interface MyCollectionPublic {
    pub fun deposit(token: @NonFungibleToken.NFT)
    pub fun getIDs(): [UInt64]
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
    pub fun borrowEntireNFT(id: UInt64): &NFT
  }

  pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MyCollectionPublic {
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let nft <- self.ownedNFTs.remove(key: withdrawID) 
            ?? panic("This NFT does not exist in this Collection.")
      emit Withdraw(id: nft.id, from: self.owner?.address)
      return <- nft
    }

    pub fun deposit(token: @NonFungibleToken.NFT) {
      let nft <- token as! @NFT
      emit Deposit(id: nft.id, to: self.owner?.address)
      self.ownedNFTs[nft.id] <-! nft
    }

    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }


    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?) ?? panic ("Nothing exists at this index")
    }

    pub fun borrowEntireNFT(id: UInt64): &NFT {
      let refNFT = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?  ?? panic("No NFT Found")
      return refNFT as! &NFT
    }

    init() {
      self.ownedNFTs <- {}
    }

    destroy() {
      destroy self.ownedNFTs
    }
  }

  pub fun createEmptyCollection(): @NonFungibleToken.Collection {
    return <- create Collection()
  }

  pub resource Minter {

    pub fun createNFT(vouncher_name: String, brand_code: String, vouncher_code: String,expired_date: UInt64,discount_per: Int,tokenURI: String): @NFT {
      return <- create NFT(_vouncher_name: vouncher_name, _brand_code: brand_code, _vouncher_code: vouncher_code,_expired_date: expired_date,_discount_per: discount_per,_tokenURI: tokenURI)
    }

    pub fun createMinter(): @Minter {
      return <- create Minter()
    }

  }

  init() {
    self.totalSupply = 0
    emit ContractInitialized()
    self.account.save(<- create Minter(), to: /storage/Minter)
  }
}
