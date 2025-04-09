package entities

import (
	"time"
)

type Transaction struct {
	IdTransaction      int                 `gorm:"column:idtransaction;primaryKey;autoIncrement" json:"idtransaction"`
	TotalPrice         float64             `gorm:"column:totalprice" json:"totalprice"`
	Timestamp          time.Time           `gorm:"column:timestamp" json:"timestamp"`
	VAT                float64             `gorm:"column:vat" json:"vat"`
	UID                string              `gorm:"column:uid;size:50;not null" json:"uid"`
	IdStatus           int                 `gorm:"column:idstatus;not null" json:"idstatus"`
	TransactionDetails []TransactionDetail `gorm:"foreignKey:IdTransaction;references:IdTransaction" json:"transaction_details"`
}

func (Transaction) TableName() string {
	return "transactions"
}

type TransactionDetail struct {
	IdTransaction int     `gorm:"column:idtransaction;primaryKey" json:"idtransaction"`
	Seq           int     `gorm:"column:seq;primaryKey" json:"seq"`
	PriceNoVAT    float64 `gorm:"column:price_novat" json:"price_novat"`
	VAT           float64 `gorm:"column:vat" json:"vat"`
	Qty           int     `gorm:"column:qty" json:"qty"`
	IdProduct     int     `gorm:"column:idproduct" json:"idproduct"`
}

func (TransactionDetail) TableName() string {
	return "transactiondetail"
}

type TransactionWithStatus struct {
	IdTransaction int       `gorm:"column:idtransaction;primaryKey;autoIncrement" json:"idtransaction"`
	TotalPrice    float64   `gorm:"column:totalprice" json:"totalprice"`
	Timestamp     time.Time `gorm:"column:timestamp" json:"timestamp"`
	VAT           float64   `gorm:"column:vat" json:"vat"`
	UID           string    `gorm:"column:uid;size:50;not null" json:"uid"`
	IdStatus      int       `gorm:"column:idstatus;not null" json:"idstatus"`
	Statusname    string    `gorm:"column:name" json:"statusname"`
}

type TransactionLog struct {
	Idtransaction int       `json:"idtransaction"`
	Seq           int       `json:"seq"`
	Timestamp     time.Time `json:"timestamp"`
	UID           string    `json:"uid"`
	IdStatus      int       `gorm:"column:idstatus" json:"idstatus"`
	Statusname    string    `gorm:"column:name" json:"statusname"`
}
