package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"
	"errors"

	"gorm.io/gorm"
)

type productRepository struct {
	DB *gorm.DB
}

type IProductRepository interface {
	GetAllProduct() (*[]entities.ProductAndType, error)
	GetAllProductType() (*[]entities.ProductType, error)
	GetProductByProductTypeID(typeid int) (*[]entities.Product, error)
	GetProductByID(product_id int32) (*entities.Product, error)
	CreateProduct(product entities.Product) error
	UpdateProduct(product_id int, product entities.Product) error
	DeleteProduct(product_id int) error
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

func (repo productRepository) GetProductByID(product_id int32) (*entities.Product, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result entities.Product
	if err := repo.DB.Table("Products").Select("*").Where("idproduct").First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.ProductNotFoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo productRepository) CreateProduct(product entities.Product) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("Products").Create(&product).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (repo productRepository) UpdateProduct(product_id int, product entities.Product) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("Products").Where("productid = ?", product_id).Updates(&product).Error; err != nil {
			return err
		} else {
			return nil
		}
	}); err != nil {
		return err
	}
	return nil
}

func (repo productRepository) DeleteProduct(product_id int) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("Products").Where("productid = ?", product_id).Delete(&entities.Product{}).Error; err != nil {
			return err
		} else {
			return nil
		}
	}); err != nil {
		return nil
	}
	return nil
}
