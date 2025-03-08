package services

import (
	templateError "backend/error"
	"backend/internal/entities"
	"backend/internal/repositories"
	"strings"
)

type productService struct {
	productRepository repositories.IProductRepository
}

type IProductRepository interface {
	GetAllProduct() (*[]entities.ProductAndType, error)
	GetAllProductType() (*[]entities.ProductType, error)
	GetProductByProductTypeID(typeid int) (*[]entities.Product, error)
	CreateProduct(product entities.Product) error
}

func InitProductService(repo repositories.IProductRepository) IProductRepository {
	return &productService{
		productRepository: repo,
	}
}

func (ser productService) GetAllProduct() (*[]entities.ProductAndType, error) {
	products, err := ser.productRepository.GetAllProduct()
	if err != nil {
		return nil, err
	}
	return products, err
}

func (ser productService) GetAllProductType() (*[]entities.ProductType, error) {
	productType, err := ser.productRepository.GetAllProductType()
	if err != nil {
		return nil, err
	}
	return productType, err
}

func (ser productService) GetProductByProductTypeID(typeid int) (*[]entities.Product, error) {
	if typeid <= 0 {
		return nil, templateError.BadrequestError
	}
	return ser.productRepository.GetProductByProductTypeID(typeid)
}

func (ser productService) CreateProduct(product entities.Product) error {
	if strings.TrimSpace(product.Productname) == "" {
		return templateError.BadrequestError
	}
	if product.Priceperunit < 0 {
		return templateError.BadrequestError
	}
	if product.Costperunit < 0 {
		return templateError.BadrequestError
	}
	if product.Typeid < 0 {
		return templateError.BadrequestError
	}

	if err := ser.productRepository.CreateProduct(product); err != nil {
		return err
	}
	return nil
}

func (ser productService) DeleteProduct(productid int) error {
	return nil
}
