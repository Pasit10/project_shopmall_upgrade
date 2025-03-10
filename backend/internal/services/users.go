package services

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/internal/repositories"
)

type usersService struct {
	usersService repositories.IUsersRepository
}

type IUserService interface {
}

func InitUsersService(repo repositories.IUsersRepository) IUserService {
	return &usersService{
		usersService: repo,
	}
}

func (ser usersService) GetuserData(uid string) (*entities.UserData, error) {
	if uid == "" {
		return nil, templateError.BadrequestError
	}

	user, err := ser.usersService.GetUserData(uid)
	if err != nil {
		return nil, err
	}
	return user, nil
}
