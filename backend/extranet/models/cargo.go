package models

import "extranet/core/id"

type Cargo struct {
	tableName struct{} `pg:"extranet.cargos"`
	ID        id.ID    `json:"id"`
	Name      string   `json:"name"`
}

type ReturnCargo struct {
	ID   id.ID  `json:"job_title_id"`
	Name string `json:"name"`
}
