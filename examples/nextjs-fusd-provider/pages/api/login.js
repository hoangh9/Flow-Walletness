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
  let username = null;
  let password = null;
  if (req.body.username){
    username = req.body.username;
    password = req.body.password;
  }else{
    const DataReq = JSON.parse(req.body);
    username = DataReq.username;
    password = DataReq.password;
  }
  const result = await walletApi.loginAccount(username,password)
  res.status(200).json({
    "message": "Login success",
    "error": false,
    data:result
  })
}

const emptyBalance = "0.00000000"


