package services

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/internal/repositories"
)

type usersService struct {
	usersRepository   repositories.IUsersRepository
	productRepository repositories.IProductRepository
	cartRepository    repositories.ICartRepository
}

type IUserService interface {
	GetuserData(uid string) (*entities.UserData, error)
	InsertCart(uid string, cart_data entities.InsertCart) error
	GetCartByUID(uid string) (*[]entities.CartResponse, error)
}

func InitUsersService(repo0 repositories.IUsersRepository, repo1 repositories.IProductRepository, repo2 repositories.ICartRepository) IUserService {
	return &usersService{
		usersRepository:   repo0,
		productRepository: repo1,
		cartRepository:    repo2,
	}
}

func (ser usersService) GetuserData(uid string) (*entities.UserData, error) {
	if uid == "" {
		return nil, templateError.BadrequestError
	}

	user, err := ser.usersRepository.GetUserData(uid)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (ser usersService) InsertCart(uid string, cart_data entities.InsertCart) error {
	if cart_data.IDproduct < 0 {
		return templateError.BadrequestError
	}
	if cart_data.Quantity < 0 {
		cart_data.Quantity = 0
	}

	insertCart := entities.Cart{
		UID:       uid,
		IDproduct: cart_data.IDproduct,
		Quantity:  cart_data.Quantity,
	}

	// if _, err := ser.usersRepository.GetUserData(uid); err != nil {
	// 	return templateError.UsernotfoundError
	// }
	if cart, err := ser.cartRepository.FindCart(uid, int(cart_data.IDproduct)); err != nil {
		if err == templateError.CartNotFoundError {
			if err := ser.cartRepository.CreateCart(insertCart); err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		if err := ser.cartRepository.UpdateCart(uid, cart.IDproduct, insertCart); err != nil {
			return err
		}
	}
	return nil
}

func (ser usersService) GetCartByUID(uid string) (*[]entities.CartResponse, error) {
	_, err := ser.usersRepository.GetUserData(uid)
	if err != nil {
		return nil, err
	}

	data, err := ser.cartRepository.GetCartByUID(uid)
	if err != nil {
		return nil, err
	}
	return data, nil
}
