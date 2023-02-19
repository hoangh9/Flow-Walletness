package accounts

import (
	"github.com/flow-hydraulics/flow-wallet-api/datastore"
)

// Store manages data regarding accounts.
type Store interface {
	// List all accounts.
	Accounts(datastore.ListOptions) ([]Account, error)

	// Get account details.
	Account(address string) (Account, error)

	// Get account by username details.
	GetUsername(username string) (Account, error)

	// Get account by username details.
	AccountDetailByUsername(username string,password string) (Account, error)

	// Insert a new account.
	InsertAccount(a *Account) error

	// Update an existing account.
	SaveAccount(a *Account) error

	// Permanently delete an account, despite of `DeletedAt` field.
	HardDeleteAccount(a *Account) error
}
