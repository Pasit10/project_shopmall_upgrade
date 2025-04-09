package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"

	"gorm.io/gorm"
)

type transactionRepository struct {
	DB *gorm.DB
}

type ITransactionRepository interface {
	CreateTransaction(uid string) error
	GetTransaction(uid string) (*[]entities.Transaction, error)
	GetAllTransaction() (*[]entities.TransactionWithStatus, error)
	UpdateStatusTransaction(uid string, idtransaction int, idstatus int) error
	GetTransactionById(idtransaction int) (*entities.Transaction, error)
	GetAllTransactionLog() (*[]entities.TransactionLog, error)
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

func (repo transactionRepository) GetTransaction(uid string) (*[]entities.Transaction, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result []entities.Transaction
	if err := repo.DB.Preload("TransactionDetails").Where("uid = ?", uid).Find(&result).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

func (repo transactionRepository) GetAllTransaction() (*[]entities.TransactionWithStatus, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result []entities.TransactionWithStatus
	if err := repo.DB.Table("transactions").
		Select("transactions.idtransaction, transactions.timestamp, transactions.totalprice, transactions.vat, transactions.uid, transactions.idstatus, transactionstatus.name").
		Joins("INNER JOIN transactionstatus ON transactions.idstatus = transactionstatus.idstatus").
		Find(&result).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

func (repo transactionRepository) GetTransactionById(idtransaction int) (*entities.Transaction, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result entities.Transaction
	if err := repo.DB.Table("transactions").Where("idtransaction = ?", idtransaction).First(&result).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, templateError.TransactionNotFoundError
		}
		return nil, err
	}

	return &result, nil
}

func (repo transactionRepository) UpdateStatusTransaction(uid string, idtransaction int, idstatus int) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Exec("CALL UpdateTransactionStatus(?, ?, ?)", idtransaction, idstatus, uid).Error; err != nil {
		return err
	}
	return nil
}

func (repo transactionRepository) GetAllTransactionLog() (*[]entities.TransactionLog, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result []entities.TransactionLog
	if err := repo.DB.Table("transactionLog").
		Select("idtransaction", "seq", "timestamp", "uid", "transactionstatus.idstatus", "transactionstatus.name").
		Joins("INNER JOIN transactionstatus ON transactionLog.idstatus = transactionstatus.idstatus").
		Order("idtransaction, seq").
		Find(&result).Error; err != nil {
		return nil, err
	}

	return &result, nil
}
