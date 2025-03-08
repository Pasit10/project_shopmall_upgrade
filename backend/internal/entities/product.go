package entities

// Product struct
// type Product struct {
// 	IDproduct        int32       `json:"id"`
// 	Productname      string      `json:"product_name"`
// 	Priceperunit     float64     `json:"price_per_unit"`
// 	Costperunit      float64     `json:"cost_per_unit"`
// 	Detail           string      `json:"detail"`
// 	Stockqtyfrontend int32       `json:"stock_qty_frontend"`
// 	Stockqtybackend  int32       `json:"stock_qty_backend"`
// 	Productimage     string      `json:"product_image"` // ใช้ string แทน BLOB หรือ URL
// 	Typeid           int32       `json:"type_id"`
// 	Type             ProductType `gorm:"foreignKey:Typeid;references:Typeid" json:"product_type"` // กำหนด foreign key ให้ถูกต้อง
// }

type ProductAndType struct {
	IDproduct        int32   `json:"id"`
	Productname      string  `json:"product_name"`
	Priceperunit     float64 `json:"price_per_unit"`
	Costperunit      float64 `json:"cost_per_unit"`
	Detail           string  `json:"detail"`
	Stockqtyfrontend int32   `json:"stock_qty_frontend"`
	Stockqtybackend  int32   `json:"stock_qty_backend"`
	Productimage     string  `json:"product_image"` // ใช้ string แทน BLOB หรือ URL
	Typeid           int32   `json:"typeid"`
	Typename         string  `json:"type_name"`
}

type Product struct {
	IDproduct        int32   `json:"id"`
	Productname      string  `json:"product_name"`
	Priceperunit     float64 `json:"price_per_unit"`
	Costperunit      float64 `json:"cost_per_unit"`
	Detail           string  `json:"detail"`
	Stockqtyfrontend int32   `json:"stock_qty_frontend"`
	Stockqtybackend  int32   `json:"stock_qty_backend"`
	Productimage     string  `json:"product_image"` // ใช้ string แทน BLOB หรือ URL
	Typeid           int32   `json:"typeid"`
}

// ProductType struct
type ProductType struct {
	Typeid   int32  `json:"id"`
	Typename string `json:"name"`
	Typeimg  string `json:"type_img"`
}
