package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"
	"errors"

	"gorm.io/gorm"
)

type usersRepository struct {
	DB *gorm.DB
}

type IUsersRepository interface {
	GetUserData(uid string) (*entities.UserData, error)
	GetAllAdmin() (*[]entities.UserData, error)
	FindUserByEmail(email string) (*entities.UserData, error)
	UpdateUser(uid string, user entities.UserData) error
}

func InitUsersRepository(db *gorm.DB) IUsersRepository {
	return usersRepository{
		DB: db,
	}
}

func (repo usersRepository) GetUserData(uid string) (*entities.UserData, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result entities.UserData
	if err := repo.DB.Table("users").Select("*").Where("uid = ?", uid).First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.UsernotfoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo usersRepository) GetAllAdmin() (*[]entities.UserData, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result []entities.UserData
	if err := repo.DB.Table("users").Where("role = ? or role = ?", "admin", "superadmin").Find(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.UsernotfoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo usersRepository) FindUserByEmail(email string) (*entities.UserData, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result entities.UserData
	if err := repo.DB.Table("users").Select("*").Where("email = ?", email).First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.UsernotfoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo usersRepository) UpdateUser(uid string, user entities.UserData) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("users").Where("uid = ?", uid).Updates(&user).Error; err != nil {
			return err
		} else {
			return nil
		}
	}); err != nil {
		return err
	}
	return nil
}
