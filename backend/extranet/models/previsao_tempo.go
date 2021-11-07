package models

import (
	"extranet/core/id"
)

type PrevisaoTempo struct {
	tableName struct{} `pg:"extranet.previsao_tempo"`
	ID        id.ID    `json:"id"`
	City      id.ID    `json:"city"`
	Estate    string   `json:"estate"`
}
