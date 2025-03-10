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
