package models

import (
	"errors"
	"extranet/core/id"
	"golang.org/x/crypto/bcrypt"
)

var ErrEmailAlreadyExists = errors.New("email is already registered")
var ErrUserAlreadyExists = errors.New("user is already registered")

type User struct {
	tableName     struct{} `pg:"extranet.users"`
	Email         string   `json:"email"`
	Password      string   `json:"password"`
	ID            id.ID    `json:"id"`
	Name          string   `json:"name"`
	Surname       string   `json:"surname"`
	Sector        string   `json:"sector"`
	DateOfBirth   string   `json:"date_of_birth"`
	AdmissionDate string   `json:"admission_date"`
	Gender        string   `json:"gender"`
	CPF           string   `json:"cpf"`
	JobTitle      string   `json:"job_title"`
	Active        bool     `json:"active"`
	Role          string   `json:"role"`
}

type ReturnUser struct {
	Email    string `json:"email"`
	ID       id.ID  `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Sector   string `json:"sector"`
	Gender   string `json:"gender"`
	Active   bool   `json:"active"`
	JobTitle string `json:"job_title"`
}

type UpdateUserPayload struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Sector   string `json:"sector"`
	Gender   string `json:"gender"`
	Active   bool   `json:"active"`
	CPF      string `json:"cpf"`
	JobTitle string `json:"job_title"`
}

func (u *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	u.Password = string(bytes)
	return nil
}

func (u *User) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}

func (u *User) CreateID() {
	u.ID = id.New()
}

func (u *User) AssignRole() {
	u.Role = "user"
}
