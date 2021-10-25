package models

import (
	"extranet/core/id"
)

type Cardapio struct {
	tableName struct{} `pg:"extranet.cardapios"`
	ID        id.ID    `json:"id"`
	Name      string   `json:"name"`
	Day       string   `json:"day"`
	Items     string   `json:"items"`
	Active    bool     `json:"active"`
}

type ReturnCardapio struct {
	ID     id.ID  `json:"id"`
	Name   string `json:"name"`
	Day    string `json:"day"`
	Items  string `json:"items"`
	Active bool   `json:"active"`
}

type UpdateCardapioPayload struct {
	Day    string `json:"day"`
	Items  string `json:"items"`
	Active bool   `json:"active"`
}

type PayloadCardapio struct {
	Day   string `json:"day"`
	Items string `json:"items"`
}
