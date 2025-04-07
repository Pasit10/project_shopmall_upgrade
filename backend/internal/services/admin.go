package services

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/internal/repositories"
	"net/mail"
)

type adminService struct {
	tranxRepository repositories.ITransactionRepository
	userRepository  repositories.IUsersRepository
}

type IAdminService interface {
	GetAllTransaction() (*[]entities.TransactionWithStatus, error)
	GetAllAdmin() (*[]entities.UserData, error)
	CreateAdmin(admin entities.CreateAdmin) error
	UpdateStatusTransaction(uid string, transactionId int, status int) error
	GetAllTransactionLog() (*[]entities.TransactionLog, error)
}

func InitAdminService(repo1 repositories.ITransactionRepository, repo2 repositories.IUsersRepository) IAdminService {
	return &adminService{
		tranxRepository: repo1,
		userRepository:  repo2,
	}
}

func (ser adminService) GetAllTransaction() (*[]entities.TransactionWithStatus, error) {
	tranx, err := ser.tranxRepository.GetAllTransaction()
	if err != nil {
		return nil, err
	}
	return tranx, nil
}

func (ser adminService) UpdateStatusTransaction(uid string, transactionId int, status int) error {
	if status <= 0 || status > 7 {
		return templateError.BadrequestError
	}
	if transactionId < 0 {
		return templateError.BadrequestError
	}

	tranx, err := ser.tranxRepository.GetTransactionById(transactionId)
	if err != nil {
		return err
	}

	if tranx.IdStatus == 5 {
		return templateError.BadrequestError
	}

	if err := ser.tranxRepository.UpdateStatusTransaction(uid, transactionId, status); err != nil {
		return err
	}
	return nil
}

func (ser adminService) GetAllAdmin() (*[]entities.UserData, error) {
	admins, err := ser.userRepository.GetAllAdmin()
	if err != nil {
		return nil, err
	}

	return admins, nil
}

func (ser adminService) CreateAdmin(admin entities.CreateAdmin) error {
	if admin.Email == "" || admin.Role == "" {
		return templateError.BadrequestError
	}
	if _, err := mail.ParseAddress(admin.Email); err != nil {
		return templateError.BadrequestError
	}

	user, err := ser.userRepository.FindUserByEmail(admin.Email)
	if err != nil {
		return err
	}
	user.Role = admin.Role
	if err := ser.userRepository.UpdateUser(user.UID, *user); err != nil {
		return err
	}
	return nil
}

func (ser adminService) GetAllTransactionLog() (*[]entities.TransactionLog, error) {
	transactionLog, err := ser.tranxRepository.GetAllTransactionLog()
	if err != nil {
		return nil, err
	}
	return transactionLog, nil
}
