import WalletApiClient from "../../lib/walletApi";
import {adminAddress, baseUrl, fusdTokenName , usernamedemo , passworddemo} from "../../lib/config"

const walletApi = new WalletApiClient(baseUrl)

export default async function handler(req, res) {
  if (req.method === "GET") {
    return get(req, res)
  }

  if (req.method === "POST") {
    return post(req, res)
  }
}

async function get(req, res) {
  const accounts = await walletApi.getAccounts()
  const result = await Promise.all(accounts.map(async account => ({
    address: account.address,
    username: account.username,
    balance: await getFusdBalance(account.address) || "0",
    isAdmin: account.address === adminAddress,
    initfungibletoken: getFusdBalance(account.address) ? true : false 
  })))

  res.status(200).json(result)
}

const emptyBalance = "0.00000000"

async function post(req, res) {
  const address = await walletApi.createAccount("demo1234","demo1234",fusdTokenName)
  const result = {
    address
  }

  res.status(201).json(result)
}

async function getFusdBalance(address) {
  const result = await walletApi.getFungibleToken(address, fusdTokenName)
  return result.balance
}
