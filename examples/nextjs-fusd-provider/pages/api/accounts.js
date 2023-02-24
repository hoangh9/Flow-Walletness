import WalletApiClient from "../../lib/walletApi";
import {adminAddress, baseUrl, fusdTokenName } from "../../lib/config"

const walletApi = new WalletApiClient(baseUrl)

export default async function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res)
  }

  if (req.method === "POST") {
    return post(req, res)
  }
}

// list accounts
async function get(req, res) {
  let result = null
  if (typeof req.query.username !== 'undefined'){
    const account = await walletApi.getAccounts(req.query.username)
    if (typeof(check.address) == "undefined"){
      res.status(200).json({
        "message": "dont exist account",
        "error": true,
        data:null
      })
    }else{
      result = {
        address: account.address,
        username: account.address,
        balance: await getFusdBalance(account.address) || "0",
        isAdmin: account.address === adminAddress,
        initfungibletoken: getFusdBalance(account.address) ? true : false 
      }
    }

  }else{
    const accounts = await walletApi.getAccounts(null)
    result = await Promise.all(accounts.map(async account => ({
      address: account.address,
      username: account.username,
      balance: await getFusdBalance(account.address) || "0",
      isAdmin: account.address === adminAddress,
      initfungibletoken: getFusdBalance(account.address) ? true : false 
    })))
  }


  res.status(200).json({
    "message": "Login success",
    "error": false,
    data:result
  })
}

const emptyBalance = "0.00000000"

async function getFusdBalance(address) {
  const result = await walletApi.getFungibleToken(address, fusdTokenName)
  return result.balance
}
