package models

import (
	"extranet/core/id"
)

type Noticia struct {
	tableName struct{} `pg:"extranet.noticias"`
	ID        id.ID    `json:"id"`
	Title     string   `json:"title"`
	Subtitle  string   `json:"subtitle"`
	Address   string   `json:"address"`
	Category  string   `json:"category"`
	Image     string   `json:"image"`
	Text      string   `json:"text"`
	Active    bool     `json:"active"`
}

type ReturnNoticia struct {
	ID       id.ID  `json:"id"`
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Address  string `json:"address"`
	Category string `json:"category"`
	Image    string `json:"image"`
	Text     string `json:"text"`
	Active   bool   `json:"active"`
}

type UpdateNoticiaPayload struct {
	Title    string `json:"title"`
	Subtitle string `json:"subtitle"`
	Address  string `json:"address"`
	Category string `json:"category"`
	Image    string `json:"image"`
	Text     string `json:"text"`
	Active   bool   `json:"active"`
}

type PayloadAddress struct {
	Address string `json:"address"`
}
