package entities

type InsertCart struct {
	IDproduct int32 `json:"id"`
	Quantity  int32 `json:"qty"`
}

type Cart struct {
	UID       string `json:"uid"`
	IDproduct int32  `json:"id"`
	Quantity  int32  `json:"qty"`
	Isselect  string `json:"is_select"`
}

type CartResponse struct {
	IDproduct        string  `json:"id"`
	Productname      string  `json:"product_name"`
	Priceperunit     float64 `json:"price_per_unit"`
	Quantity         int32   `json:"qty"`
	Isselect         string  `json:"is_select"`
	Stockqtyfrontend int32   `json:"stock_qty_frontend"`
}
