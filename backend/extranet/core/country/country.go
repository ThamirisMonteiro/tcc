package country

const (
	CodeBrazil = Code("BRA")
)

type Code string

func (c Code) String() string {
	return string(c)
}

func (c Code) IsBrazil() bool {
	return c == CodeBrazil
}
