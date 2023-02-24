const jobPollInterval = 1000
const jobPollAttempts = 40

const jobStatusComplete = "COMPLETE"
const jobStatusError = "Error"

const contentTypeJson = "application/json"

export default class WalletApiClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getAccounts(username) {
    if(username == null){
      return this.get("/v1/accounts")
    }else{
      return this.get("/v1/username/"+username)
    }
    
  }

  async createAccount(username,password) {
    const check = await this.get("/v1/username/"+username)
    if (typeof(check.address) == "undefined"){
      const result = await this.post("/v1/accounts",{username:username,password:password})
      const address = await this.pollJobUntilComplete(result.jobId)
      return address
    }else{
      return null
    }

  }
  async loginAccount(username,password) {
    
    const result = await this.post("/v1/getAddressByUsername",{username:username,password:password})
    
    return result;
  }
  async initFungibleToken(address, token) {    
    return this.post(
      `/v1/accounts/${address}/fungible-tokens/${token}`
    )
  }

  async getFungibleToken(address, token) { 
    return this.get(
      `/v1/accounts/${address}/fungible-tokens/${token}`
    )
  }

  async createFungibleTokenWithdrawal(from, to, token, amount) {    
    const result = await this.post(
      `/v1/accounts/${from}/fungible-tokens/${token}/withdrawals`,
      {
        amount,
        recipient: to,
      },
    )

    const { jobId } = result;

    const txId = await this.pollJobUntilComplete(jobId)

    const withdrawal = await this.getFungibleTokenWithdrawal(from, token, txId)

    return withdrawal
  }

  async getFungibleTokenWithdrawal(from, token, id) {    
    return this.get(
      `/v1/accounts/${from}/fungible-tokens/${token}/withdrawals/${id}`
    )
  }

  async getFungibleTokenDeposits(from, token) {    
    return this.get(
      `/v1/accounts/${from}/fungible-tokens/${token}/deposits}`
    )
  }

  async getJob(id) {    
    return this.get(`/v1/jobs/${id}`)
  }

  async pollJobUntilComplete(id) {
    for (let i = 0; i < jobPollAttempts; i++) {
      
      const job = await this.getJob(id)
      if (job.state === jobStatusError) {
        throw "failed job"
      }
      
      if (job.state === jobStatusComplete) {
        return job.result
      }

      await sleep(jobPollInterval);
    }

    return null
  }

  async post(endpoint, body) {
    return fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': contentTypeJson,
        'Idempotency-Key':Math.random().toString(16).slice(2)
      },
      body: JSON.stringify(body),
    }).then(res => res.json())
  }
  
  async get(endpoint) {
    return fetch(this.baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': contentTypeJson,
      },
    })
    .then(res => res.json())
    .catch((error) => {
      return {
        balance: null
      }
    });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let increment = 1013904223;
let modulus = 232;
let multiplier = 1664525; // see Numerical Recipes for initial values
let seed;

function linearCongruentialGenerator() {
    X = ( multiplier * X + increment ) % modulus;
    return seed;
}