import WalletApiClient from "../../lib/walletApi";
import {adminAddress, baseUrl, fusdTokenName} from "../../lib/config"

const walletApi = new WalletApiClient(baseUrl)

export default async function handler(req, res) {
  if (req.method === "POST") {
    return post(req, res)
  }

  res.status(405).send()
}

async function post(req, res) {

  let recipient = null;
  let amount = null;
  if (req.body.recipient){
    recipient = req.body.recipient;
    amount = req.body.amount;
  }else{
    const DataReq = JSON.parse(req.body);
    recipient = DataReq.recipient;
    amount = DataReq.amount;
  }

  await walletApi.createFungibleTokenWithdrawal(
    adminAddress, 
    recipient,
    fusdTokenName,
    sanitizeAmount(amount),
  )

  res.status(200).json({ recipient, amount })
}

function sanitizeAmount(amount) {
  if (amount.includes(".")) {
    return amount
  }

  return amount + ".0"
}
