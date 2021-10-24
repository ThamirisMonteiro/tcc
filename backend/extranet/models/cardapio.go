package models

import (
	"extranet/core/id"
)

type Cardapio struct {
	tableName    struct{} `pg:"extranet.cardapios"`
	ID           id.ID    `json:"id"`
	Name         string   `json:"name"`
	Day          string   `json:"day"`
	Carboidratos string   `json:"carboidratos"`
	Proteinas    string   `json:"proteinas"`
	Saladas      string   `json:"saladas"`
	Legumes      string   `json:"legumes"`
	Molhos       string   `json:"molhos"`
	Graos        string   `json:"graos"`
	Sucos        string   `json:"sucos"`
	Sobremesas   string   `json:"sobremesas"`
	Active       bool     `json:"active"`
}

type ReturnCardapio struct {
	ID           id.ID  `json:"id"`
	Name         string `json:"name"`
	Day          string `json:"day"`
	Carboidratos string `json:"carboidratos"`
	Proteinas    string `json:"proteinas"`
	Saladas      string `json:"saladas"`
	Legumes      string `json:"legumes"`
	Molhos       string `json:"molhos"`
	Graos        string `json:"graos"`
	Sucos        string `json:"sucos"`
	Sobremesas   string `json:"sobremesas"`
	Active       bool   `json:"active"`
}

type UpdateCardapioPayload struct {
	Day          string `json:"day"`
	Carboidratos string `json:"carboidratos"`
	Proteinas    string `json:"proteinas"`
	Saladas      string `json:"saladas"`
	Legumes      string `json:"legumes"`
	Molhos       string `json:"molhos"`
	Graos        string `json:"graos"`
	Sucos        string `json:"sucos"`
	Sobremesas   string `json:"sobremesas"`
	Active       bool   `json:"active"`
}

type PayloadCardapio struct {
	Day          string `json:"day"`
	Carboidratos string `json:"carboidratos"`
	Proteinas    string `json:"proteinas"`
	Saladas      string `json:"saladas"`
	Legumes      string `json:"legumes"`
	Molhos       string `json:"molhos"`
	Graos        string `json:"graos"`
	Sucos        string `json:"sucos"`
	Sobremesas   string `json:"sobremesas"`
}
