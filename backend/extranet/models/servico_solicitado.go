package models

import (
	"extranet/core/id"
)

type ServicoSolicitado struct {
	tableName   struct{} `pg:"extranet.servicos_solicitados"`
	ID          id.ID    `json:"id"`
	CreatedDate string   `json:"created_date"`
	Status      string   `json:"status"`
	ServiceID   id.ID    `json:"service_id"`
	UserID      id.ID    `json:"user_id"`
	Description string   `json:"description"`
}

type ReturnServicoSolicitado struct {
	Name        string `json:"name"`
	Category    string `json:"category"`
	Sector      string `json:"sector"`
	CreatedDate string `json:"created_date"`
	Status      string `json:"status"`
	Description string `json:"description"`
}

type ServicoSolicitadoJSON struct {
	Name        string `json:"name"`
	Category    string `json:"category"`
	Description string `json:"description"`
	UserID      id.ID  `json:"user_id"`
}
