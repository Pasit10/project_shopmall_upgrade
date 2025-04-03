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
	UpdateCartManyByUID(uid string, cart_data []entities.Cart) error
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

	quantity := cart_data.Quantity
	if quantity <= 0 {
		quantity = 1
	}

	product, err := ser.productRepository.GetProductByID(int(cart_data.IDproduct))
	if err != nil {
		return err
	}

	cart, err := ser.cartRepository.FindCart(uid, int(cart_data.IDproduct))
	if err != nil {
		if err == templateError.CartNotFoundError {
			newCart := entities.Cart{
				UID:       uid,
				IDproduct: cart_data.IDproduct,
				Quantity:  quantity,
				Isselect:  "F",
			}
			return ser.cartRepository.CreateCart(newCart)
		}
		return err
	}
	newQuantity := cart.Quantity + quantity
	if newQuantity > product.Stockqtyfrontend {
		return templateError.InsufficientStockError
	}

	updateCart := entities.Cart{
		UID:       uid,
		IDproduct: cart_data.IDproduct,
		Quantity:  newQuantity,
		Isselect:  "F",
	}

	if err := ser.cartRepository.UpdateCart(uid, cart.IDproduct, updateCart); err != nil {
		return err
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

func (ser usersService) UpdateCartManyByUID(uid string, cart_data []entities.Cart) error {
	_, err := ser.usersRepository.GetUserData(uid)
	if err != nil {
		return err
	}

	if len(cart_data) == 0 {
		return templateError.BadrequestError
	}

	for index, cart := range cart_data {
		cart_data[index].UID = uid
		if err := ser.cartRepository.UpdateCart(uid, cart.IDproduct, cart); err != nil {
			return err
		}
	}
	return nil
}
