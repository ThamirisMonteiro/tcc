package models

import (
	"extranet/core/id"
)

type Foto struct {
	tableName struct{} `pg:"extranet.fotos"`
	ID        id.ID    `json:"id"`
	Image     string   `json:"image"`
	Galeria   string   `json:"galeria"`
	Active    bool     `json:"active"`
}

type ReturnFoto struct {
	ID      id.ID  `json:"id"`
	Image   string `json:"image"`
	Galeria string `json:"galeria"`
	Active  bool   `json:"active"`
}

type UpdateFotoPayload struct {
	Image  string `json:"image"`
	Active bool   `json:"active"`
}

type PayloadImage struct {
	Image string `json:"image"`
}
