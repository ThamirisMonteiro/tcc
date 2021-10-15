package models

import (
	"extranet/core/id"
)

type Galeria struct {
	tableName   struct{} `pg:"extranet.galerias"`
	ID          id.ID    `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	Category    string   `json:"category"`
	CoverImage  string   `json:"cover_image"`
	Active      bool     `json:"active"`
}

type ReturnGaleria struct {
	ID          id.ID  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Date        string `json:"date"`
	Category    string `json:"category"`
	CoverImage  string `json:"cover_image"`
	Active      bool   `json:"active"`
}

type UpdateGaleriaPayload struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Date        string `json:"date"`
	Category    string `json:"category"`
	CoverImage  string `json:"cover_image"`
	Active      bool   `json:"active"`
}

type PayloadName struct {
	Name string `json:"name"`
}
