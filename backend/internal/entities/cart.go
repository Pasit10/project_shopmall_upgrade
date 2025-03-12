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
