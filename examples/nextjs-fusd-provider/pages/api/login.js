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

// Login
async function post(req, res) {
  const { username, password } = JSON.parse(req.body)
  const result = await walletApi.loginAccount(username,password)

  res.status(200).json({
    "message": "Login success",
    "error": false,
    data:result
  })
}

const emptyBalance = "0.00000000"


