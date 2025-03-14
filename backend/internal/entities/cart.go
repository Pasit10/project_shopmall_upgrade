package entities

type InsertCart struct {
	IDproduct int32 `json:"idproduct"`
	Quantity  int32 `json:"qty"`
}

type Cart struct {
	UID       string `json:"uid"`
	IDproduct int32  `json:"idproduct"`
	Quantity  int32  `json:"qty"`
}

type CartResponse struct {
	IDproduct    string  `json:"idproduct"`
	Productname  string  `json:"product_name"`
	Priceperunit float64 `json:"price_per_unit"`
	Quantity     int32   `json:"qty"`
}
