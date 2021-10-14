package uuid

import "github.com/erichnascimento/golib/uuid"

func UUID() string {
	return uuid.NewUUID().String()
}
