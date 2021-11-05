package models

import (
	"extranet/core/id"
	"time"
)

type ServicoSolicitado struct {
	tableName   struct{}  `pg:"extranet.servicos_solicitados"`
	ID          id.ID     `json:"id"`
	CreatedDate time.Time `json:"created_date"`
	Status      string    `json:"status"`
	ServiceID   id.ID     `json:"service_id"`
	UserID      id.ID     `json:"user_id"`
}

type ReturnServicoSolicitado struct {
	ID          id.ID     `json:"id"`
	CreatedDate time.Time `json:"created_date"`
	Status      string    `json:"status"`
	ServiceID   id.ID     `json:"service_id"`
	UserID      id.ID     `json:"user_id"`
}
