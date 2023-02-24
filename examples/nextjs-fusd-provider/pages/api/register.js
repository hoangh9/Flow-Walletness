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

//register
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
  
  const address = await walletApi.createAccount(username,password,fusdTokenName)
  if(address != null){
    await walletApi.initFungibleToken(address, fusdTokenName)
    res.status(201).json({
      "message": "New User Created",
      "error": false,
      data:{
          address:address,
          username:username
      }
    })
  }else{
    res.status(201).json({
        "message": "Username existed!",
        "error": true,
        data:{
            address:null,
            username:null
        }
      }) 
  }

}

async function getFusdBalance(address) {
  const result = await walletApi.getFungibleToken(address, fusdTokenName)
  return result.balance
}
