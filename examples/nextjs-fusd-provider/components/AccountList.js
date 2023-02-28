import { useState } from 'react'
import {
  Table,
  Button,
  Spacer,
  Tooltip,
  Badge,
  useToasts,
  Input
} from "@geist-ui/react"
import { UserPlus } from '@geist-ui/react-icons'
import { createAccount , initFungibleToken } from '../lib/actions'

const tooltipMessage = "This is the account that supplies FUSD for purchase."

export default function AccountList({ accounts, onCreate , onReload }) {

  const [isLoading, setIsLoading] = useState(false)
  const [, setToast] = useToasts()
  const create = async event => {
    event.preventDefault()

    setIsLoading(true)
    console.log(event.target.username.value)
    const account = await createAccount(event.target.username.value,event.target.password.value)

    onCreate(account)

    setIsLoading(false)
  }
  const initFungible = async (event,address) => {
    event.preventDefault()

    setIsLoading(true)

    const account = await initFungibleToken(address)

    await onReload()

    setToast({
      text: `${address} accept to fUSD.`,
      type: "success",
      delay: 5000,
    })

    setIsLoading(false)
  }
  function formatAccounts(accounts) {
    return accounts.data.map(account => {
      if (account.isAdmin) {
        return formatAdminAccount(account)
      }
      if (account.balance == "0") {
        return formatBalanceAccount(account)
      }
      return account
    })
  }
  
  function formatAdminAccount(account) {
    return {
      address: (
        <>
          {account.address}
          <Tooltip text={tooltipMessage}>
            <Badge 
              style={{ marginLeft: "0.5rem" }}
              type="success">
              Supplier
            </Badge>
          </Tooltip>
        </>
      ),
      balance: account.balance
    }
  }
  function formatBalanceAccount(account) {
    return {
      address: account.address,
      balance: (
        <>
          <Tooltip text={tooltipMessage}>
            <Button
              auto
              size="small"
              onClick={(event)=>initFungible(event,account.address)}
              >
              Accept fUSD
            </Button>
          </Tooltip>
        </>
      )
    }
    
  }
  return (
    <>
      <Table data={formatAccounts(accounts)}>
        <Table.Column prop="address" label="address" />
        <Table.Column prop="balance" label="FUSD balance" />
        <Table.Column prop="username" label="Username" />
      </Table>
      
      <Spacer y={.5} />
      <form onSubmit={create}>
        <Input 
            label="Username"
            name="username"
            placeholder="Demo123..."
            width="100%" />
          <Spacer y={.5} />
        <Input label="Password" placeholder="****..." name="password" width="100%" />
        <Spacer y={.5} />
        <Button
          auto
          size="small"
          icon={<UserPlus />}
          loading={isLoading}
          htmlType="submit">
          Create test account
        </Button>
      </form>

    </>
  )
}


