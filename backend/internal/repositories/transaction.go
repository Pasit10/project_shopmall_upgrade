package repositories

import (
	templateError "backend/error"

	"gorm.io/gorm"
)

type transactionRepository struct {
	DB *gorm.DB
}

type ITransactionRepository interface {
	CreateTransaction(uid string) error
}

func InitTransactionRepository(db *gorm.DB) ITransactionRepository {
	return transactionRepository{
		DB: db,
	}
}

func (repo transactionRepository) CreateTransaction(uid string) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) (err error) {
		if err = tx.Exec("CALL AddTransactionDetails(?)", uid).Error; err != nil {
			return
		}
		return
	}); err != nil {
		return err
	}
	return nil
}
