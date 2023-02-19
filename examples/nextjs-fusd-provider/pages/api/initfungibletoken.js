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
  const { address, token } = req.body

  const result = await walletApi.initFungibleToken(
    address,
    token,
  )

  res.status(200).json(result)
}
