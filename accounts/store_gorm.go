package accounts

import (
	"github.com/flow-hydraulics/flow-wallet-api/datastore"
	"gorm.io/gorm"
)

type GormStore struct {
	db *gorm.DB
}

func NewGormStore(db *gorm.DB) Store {
	return &GormStore{db}
}

func (s *GormStore) Accounts(o datastore.ListOptions) (aa []Account, err error) {
	err = s.db.
		Order("created_at desc").
		Limit(o.Limit).
		Offset(o.Offset).
		Find(&aa).Error
	return
}

func (s *GormStore) Account(address string) (a Account, err error) {
	err = s.db.Preload("Keys").First(&a, "address = ?", address).Error
	return
}
func (s *GormStore) AccountDetailByUsername(username string , password string) (a Account, err error) {
	err = s.db.Select("address", "type").Where(&Account{Username: username, Password: password}).First(&a).Error
	return
}
func (s *GormStore) GetUsername(username string) (a Account, err error) {
	err = s.db.Where(&Account{Username: username}).First(&a).Error
	return
}
func (s *GormStore) InsertAccount(a *Account) error {
	return s.db.Create(a).Error
}

func (s *GormStore) SaveAccount(a *Account) error {
	return s.db.Save(&a).Error
}

func (s *GormStore) HardDeleteAccount(a *Account) error {
	return s.db.Unscoped().Delete(a).Error
}
