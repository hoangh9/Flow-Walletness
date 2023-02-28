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
    const listTokenDeposits = await walletApi.getTokenDeposits(req.query.address,fusdTokenName);
    listTokenDeposits.forEach(item => {
      item.push({type:"income"})
    });
    const listTokenWithdrawals = await walletApi.getTokenwithdrawals(req.query.address,fusdTokenName);
    listTokenWithdrawals.forEach(item => {
      item.push({type:"expense"})
    });
    const data = listTokenDeposits.concat(listTokenWithdrawals).sort((a, b) => a.createdAt - b.createdAt);
    console.log(data);
      return res.status(200).json({
        "message": "success",
        "error": false,
        data:data
      })
}

