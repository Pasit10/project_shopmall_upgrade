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

type IProductService interface {
	GetAllProduct() (*[]entities.ProductAndType, error)
	GetProductByID(product_id int) (*entities.Product, error)
	GetAllProductType() (*[]entities.ProductType, error)
	GetProductByProductTypeID(typeid int) (*[]entities.Product, error)
	CreateProduct(product entities.Product) error
	UpdateProduct(product_id int, newproduct entities.Product) error
	DeleteProduct(product_id int) error
	GetProductFilter(typeid int, minprice float64, maxprice float64) (*entities.ProductWithFilter, error)
	UpdateQtyProduct(product_id int, qty int) error
}

func InitProductService(repo repositories.IProductRepository) IProductService {
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

func (ser productService) GetProductByID(product_id int) (*entities.Product, error) {
	if product_id < 0 {
		return nil, templateError.BadrequestError
	}
	product, err := ser.productRepository.GetProductByID(product_id)
	if err != nil {
		return nil, err
	}
	return product, nil
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

func (ser productService) UpdateProduct(product_id int, newproduct entities.Product) error {
	if product_id < 0 {
		return templateError.BadrequestError
	}
	_, err := ser.productRepository.GetProductByID(product_id)
	if err != nil {
		return err
	}

	if newproduct.IDproduct < 0 {
		return templateError.BadrequestError
	}
	if strings.TrimSpace(newproduct.Productname) == "" {
		return templateError.BadrequestError
	}
	if newproduct.Priceperunit < 0 {
		return templateError.BadrequestError
	}
	if newproduct.Costperunit < 0 {
		return templateError.BadrequestError
	}
	if newproduct.Typeid < 0 {
		return templateError.BadrequestError
	}
	if _, err := ser.productRepository.GetProductTypeByTypeid(int(newproduct.Typeid)); err != nil {
		return err
	}

	if err := ser.productRepository.UpdateProduct(product_id, newproduct); err != nil {
		return err
	}
	return nil
}

func (ser productService) DeleteProduct(product_id int) error {
	if product_id < 0 {
		return templateError.BadrequestError
	}

	_, err := ser.productRepository.GetProductByID(product_id)
	if err != nil {
		return err
	}

	if err := ser.productRepository.DeleteProduct(product_id); err != nil {
		return err
	}
	return nil
}

func (ser productService) GetProductFilter(typeid int, minprice float64, maxprice float64) (*entities.ProductWithFilter, error) {
	if typeid < 0 || minprice < 0 || maxprice < 0 {
		return nil, templateError.BadrequestError
	}
	if minprice > maxprice {
		return nil, templateError.BadrequestError
	}

	productfilter, err := ser.productRepository.GetProductFilter(typeid, minprice, maxprice)
	if err != nil {
		return nil, err
	}
	return productfilter, nil
}

func (ser productService) UpdateQtyProduct(product_id int, qty int) error {
	if product_id < 0 {
		return templateError.BadrequestError
	}
	if qty < 0 {
		return templateError.BadrequestError
	}

	product, err := ser.productRepository.GetProductByID(product_id)
	if err != nil {
		return err
	}

	product.Stockqtyfrontend += int32(qty)
	product.Stockqtybackend += int32(qty)

	if err := ser.productRepository.UpdateProduct(product_id, *product); err != nil {
		return err
	}
	return nil
}
