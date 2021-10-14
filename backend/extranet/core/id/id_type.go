package id

import "extranet/core/uuid"

type ID string

func (i ID) String() string {
	return string(i)
}

func New() ID {
	return ID(uuid.UUID())
}
