package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"

	"gorm.io/gorm"
)

type productRepository struct {
	DB *gorm.DB
}

type IProductRepository interface {
	GetAllProduct() (*[]entities.ProductAndType, error)
	GetAllProductType() (*[]entities.ProductType, error)
	GetProductByProductTypeID(typeid int) (*[]entities.Product, error)
}

func InitProdcutRepository(db *gorm.DB) IProductRepository {
	return productRepository{
		DB: db,
	}
}

func (repo productRepository) GetAllProduct() (*[]entities.ProductAndType, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result []entities.ProductAndType
	if err := repo.DB.Table("Products").
		Select("idproduct", "productname", "priceperunit", "costperunit", "detail", "stockqtyfrontend", "stockqtybackend", "productimage", "Products.typeid", "typename").
		Joins("INNER JOIN ProductType ON ProductType.typeid = Products.typeid").
		Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (repo productRepository) GetAllProductType() (*[]entities.ProductType, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result []entities.ProductType
	if err := repo.DB.Table("Producttype").Select("*").Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (repo productRepository) GetProductByProductTypeID(typeid int) (*[]entities.Product, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result []entities.Product
	if err := repo.DB.Table("Products").Select("*").Where("typeid = ?", typeid).Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}
