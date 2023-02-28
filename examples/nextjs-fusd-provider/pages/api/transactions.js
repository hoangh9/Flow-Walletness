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
    const transactions = await walletApi.getTransactions(req.query.address)  
      return res.status(200).json({
        "message": "success",
        "error": false,
        data:transactions
      })
}

