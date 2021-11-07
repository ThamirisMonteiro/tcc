package models

import (
	"extranet/core/id"
)

type Servico struct {
	tableName         struct{} `pg:"extranet.servicos"`
	ID                id.ID    `json:"id"`
	Name              string   `json:"name"`
	Category          string   `json:"category"`
	ResponsibleSector string   `json:"responsible_sector"`
	Active            bool     `json:"active"`
}

type ReturnServico struct {
	tableName         struct{} `pg:"extranet.servicos"`
	ID                id.ID    `json:"id"`
	Name              string   `json:"name"`
	Category          string   `json:"category"`
	ResponsibleSector string   `json:"responsible_sector"`
	Active            bool     `json:"active"`
	Quantity          string   `json:"quantity"`
}

type UpdateServicoPayload struct {
	Category          string `json:"category"`
	ResponsibleSector string `json:"responsible_sector"`
	Active            bool   `json:"active"`
}

type PayloadServico struct {
	Category          string `json:"category"`
	ResponsibleSector string `json:"responsible_sector"`
}
