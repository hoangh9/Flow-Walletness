export async function purchaseFusd(recipient, amount) {
  return post('/api/purchase', { recipient, amount })
}

export async function createAccount(username,password) {
  return post('/api/accounts', { username:username,password:password })
}

export async function initFungibleToken(address) {
  return post(`/api/initfungibletoken/`,{address:address,token:"fUSD"})
}

export async function listAccounts() {
  return get('/api/accounts')
}

const contentType = "application/json"

async function get(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': contentType
    }
  }).then(res => res.json())
}

async function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': contentType
    },
    body: JSON.stringify(body),
  }).then(res => res.json())
}
