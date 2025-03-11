package repositories

import (
	templateError "backend/error"
	"backend/internal/entities"
	"errors"
	"sync"

	"gorm.io/gorm"
)

type productRepository struct {
	DB *gorm.DB
}

type IProductRepository interface {
	GetAllProduct() (*[]entities.ProductAndType, error)
	GetAllProductType() (*[]entities.ProductType, error)
	GetProductByProductTypeID(typeid int) (*[]entities.Product, error)
	GetProductByID(product_id int) (*entities.Product, error)
	GetProductTypeByTypeid(typeid int) (*entities.ProductType, error)
	CreateProduct(product entities.Product) error
	UpdateProduct(product_id int, product entities.Product) error
	DeleteProduct(product_id int) error
	GetProductFilter(typeid int, startprice float64, endprice float64) (*entities.ProductWithFilter, error)
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
	if err := repo.DB.Table("products").
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
	if err := repo.DB.Table("producttype").Select("*").Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (repo productRepository) GetProductByProductTypeID(typeid int) (*[]entities.Product, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result []entities.Product
	if err := repo.DB.Table("products").Select("*").Where("typeid = ?", typeid).Find(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (repo productRepository) GetProductByID(product_id int) (*entities.Product, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}
	var result entities.Product
	if err := repo.DB.Table("products").Select("*").Where("idproduct = ?", product_id).First(&result).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.ProductNotFoundError
		} else {
			return nil, err
		}
	}
	return &result, nil
}

func (repo productRepository) GetProductTypeByTypeid(typeid int) (*entities.ProductType, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var ressult entities.ProductType
	if err := repo.DB.Table("producttype").Select("*").Where("typeid = ?", typeid).First(&ressult).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, templateError.ProductTypeNotFoundError
		} else {
			return nil, err
		}
	}
	return &ressult, nil
}

func (repo productRepository) CreateProduct(product entities.Product) error {
	if repo.DB == nil {
		return templateError.DatabaseConnectedError
	}

	if err := repo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Table("products").Create(&product).Error; err != nil {
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
		if err := tx.Table("products").Where("idproduct = ?", product_id).Updates(&product).Error; err != nil {
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
		if err := tx.Table("products").Where("idproduct= ?", product_id).Delete(&entities.Product{}).Error; err != nil {
			return err
		} else {
			return nil
		}
	}); err != nil {
		return nil
	}
	return nil
}
func (repo productRepository) GetProductFilter(typeid int, minprice float64, maxprice float64) (*entities.ProductWithFilter, error) {
	if repo.DB == nil {
		return nil, templateError.DatabaseConnectedError
	}

	var max_price float64
	var products []entities.Product
	var wg sync.WaitGroup
	var err1, err2 error
	wg.Add(2)

	go func() {
		defer wg.Done()
		err1 = repo.DB.Table("products").
			Select("MAX(pricePerUnit)").
			Where("typeid = ? AND pricePerUnit BETWEEN ? AND ?", typeid, minprice, maxprice).
			Scan(&max_price).Error
	}()

	go func() {
		defer wg.Done()
		err2 = repo.DB.Table("products").
			Where("typeid = ? AND pricePerUnit BETWEEN ? AND ?", typeid, minprice, maxprice).
			Find(&products).Error
	}()

	wg.Wait()
	if err1 != nil {
		return nil, err1
	}
	if err2 != nil {
		return nil, err2
	}

	result := entities.ProductWithFilter{
		Maxprice: max_price,
		Product:  products,
	}
	return &result, nil
}
