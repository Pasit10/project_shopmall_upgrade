package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"
	"errors"

	"gorm.io/gorm"
)

type cartRepository struct {
	DB *gorm.DB
}

type ICartRepository interface {
	GetCartByUID(uid string) (*[]entities.CartResponse, error)
	CreateCart(cartdata entities.Cart) error
	FindCart(uid string, idproduct int) (*entities.Cart, error)
	UpdateCart(uid string, idproduct int32, cartdata entities.Cart) error
	DeleteCart(uid string, idproduct int) error
}

func InitCartRepository(db *gorm.DB) ICartRepository {
	return &cartRepository{
		DB: db,
	}
}

func (repo cartRepository) GetCartByUID(uid string) (*[]entities.CartResponse, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result []entities.CartResponse
	if err := repo.DB.Table("cart").Select("cart.idproduct,productname,priceperunit,quantity,isselect,stockqtyfrontend").
		Joins("INNER JOIN Products ON Products.idproduct = cart.idproduct").
		Where("uid = ?", uid).Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (repo cartRepository) FindCart(uid string, idproduct int) (*entities.Cart, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var result entities.Cart
	if err := repo.DB.Table("cart").Select("*").Where("uid = ? and idproduct = ?", uid, idproduct).First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.CartNotFoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo cartRepository) CreateCart(cartdata entities.Cart) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("cart").Create(&cartdata).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (repo cartRepository) UpdateCart(uid string, idproduct int32, cartdata entities.Cart) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("cart").Where("uid = ? and idproduct = ?", uid, idproduct).Updates(&cartdata).Error; err != nil {
			return err
		} else {
			return nil
		}
	}); err != nil {
		return err
	}
	return nil
}

func (repo cartRepository) DeleteCart(uid string, idproduct int) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("cart").Where("uid = ? and idproduct = ?", uid, idproduct).Delete(&entities.Cart{}).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
