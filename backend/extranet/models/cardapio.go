package models

import (
	"extranet/core/id"
)

type Cardapio struct {
	tableName   struct{} `pg:"extranet.cardapios"`
	ID          id.ID    `json:"id"`
	Name        string   `json:"name"`
	Day         string   `json:"day"`
	Carboidrato string   `json:"carboidrato"`
	Proteina    string   `json:"proteina"`
	Salada      string   `json:"salada"`
	Legume      string   `json:"legume"`
	Molho       string   `json:"molho"`
	Grao        string   `json:"grao"`
	Suco        string   `json:"suco"`
	Sobremesa   string   `json:"sobremesa"`
	Active      bool     `json:"active"`
}

type ReturnCardapio struct {
	ID          id.ID  `json:"id"`
	Name        string `json:"name"`
	Day         string `json:"day"`
	Carboidrato string `json:"carboidrato"`
	Proteina    string `json:"proteina"`
	Salada      string `json:"salada"`
	Legume      string `json:"legume"`
	Molho       string `json:"molho"`
	Grao        string `json:"grao"`
	Suco        string `json:"suco"`
	Sobremesa   string `json:"sobremesa"`
	Active      bool   `json:"active"`
}

type UpdateCardapioPayload struct {
	Day         string `json:"day"`
	Carboidrato string `json:"carboidrato"`
	Proteina    string `json:"proteina"`
	Salada      string `json:"salada"`
	Legume      string `json:"legume"`
	Molho       string `json:"molho"`
	Grao        string `json:"grao"`
	Suco        string `json:"suco"`
	Sobremesa   string `json:"sobremesa"`
	Active      bool   `json:"active"`
}

type PayloadCardapio struct {
	Day         string `json:"day"`
	Carboidrato string `json:"carboidrato"`
	Proteina    string `json:"proteina"`
	Salada      string `json:"salada"`
	Legume      string `json:"legume"`
	Molho       string `json:"molho"`
	Grao        string `json:"grao"`
	Suco        string `json:"suco"`
	Sobremesa   string `json:"sobremesa"`
}
