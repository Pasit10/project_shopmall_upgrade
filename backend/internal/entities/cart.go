package entities

type InsertCart struct {
	IDproduct int `json:"id"`
	Quantity  int `json:"qty"`
}

type Cart struct {
	UID       string `json:"uid"`
	IDproduct int    `json:"id"`
	Quantity  int    `json:"qty"`
	Isselect  string `json:"is_select"`
}

type UpdateCart struct {
	Cart []Cart `json:"cart"`
}

type CartResponse struct {
	IDproduct        int     `json:"id"`
	Productname      string  `json:"product_name"`
	Priceperunit     float64 `json:"price_per_unit"`
	Quantity         int     `json:"qty"`
	Isselect         string  `json:"is_select"`
	Stockqtyfrontend int     `json:"stock_qty_frontend"`
}
