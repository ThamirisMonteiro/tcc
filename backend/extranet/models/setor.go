package models

import "extranet/core/id"

type Setor struct {
	tableName struct{} `pg:"extranet.setores"`
	ID        id.ID    `json:"id"`
	Name      string   `json:"name"`
}

type ReturnSetor struct {
	ID   id.ID  `json:"setor_id"`
	Name string `json:"name"`
}
