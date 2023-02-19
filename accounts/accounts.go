// Package account provides functions for account management on Flow blockhain.
package accounts

import (
	"time"

	"github.com/flow-hydraulics/flow-wallet-api/keys"
	"gorm.io/gorm"
)

type AccountType string

const AccountTypeCustodial = "custodial"
const AccountTypeNonCustodial = "non-custodial"

// Account struct represents a storable account.
type Account struct {
	Address   string          `json:"address" gorm:"primaryKey"`
	Username   string         `json:"username" gorm:"column:username"`
	Password   string         `json:"-" gorm:"column:password"`
	Keys      []keys.Storable `json:"keys" gorm:"foreignKey:AccountAddress;references:Address;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Type      AccountType     `json:"type" gorm:"default:custodial"`
	CreatedAt time.Time       `json:"createdAt" `
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt gorm.DeletedAt  `json:"-" gorm:"index"`
}

type AccountRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}