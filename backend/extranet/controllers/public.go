package controllers

import (
	"extranet/auth"
	"extranet/models"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"log"
	"math/rand"
	"net/smtp"
	"strings"
	"time"
)

type Env struct {
	DB *pg.DB
}

// ************ USERS ************ //

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ResetPayload struct {
	Email string `json:"email"`
}

type ChangePasswordPayload struct {
	Email       string `json:"email"`
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (e *Env) Signup(c *gin.Context) {
	var user models.User
	err := c.ShouldBindJSON(&user)
	if err != nil ||
		user.Email == "" ||
		user.Name == "" ||
		user.Surname == "" ||
		user.Sector == "" ||
		user.DateOfBirth == "" ||
		user.AdmissionDate == "" ||
		user.Gender == "" ||
		user.CPF == "" ||
		user.JobTitle == "" {
		log.Println(err)
		log.Println(user)
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	password := e.generateRandomPassword()

	err = user.HashPassword(password)
	if err != nil {
		log.Println(err.Error())
		c.JSON(500, gin.H{
			"msg": "error hashing password",
		})
		c.Abort()
		return
	}

	user.CreateID()

	err = e.CreateUserRecord(user)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	err = e.sendEmail("signup", user.Email, password)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error sending email",
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "user created successfully"})
}

func (e *Env) Login(c *gin.Context) {
	var payload LoginPayload
	var user models.User
	err := c.ShouldBindJSON(&payload)
	if err != nil || payload.Email == "" || payload.Password == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}
	err = e.DB.Model(&user).
		Where("email = ?", payload.Email).
		Select()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}
	errPassword := user.CheckPassword(payload.Password)
	if errPassword != nil {
		log.Println(err)
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}
	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}
	signedToken, err := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": "error signing token",
		})
		c.Abort()
		return
	}
	tokenResponse := LoginResponse{
		Token: signedToken,
	}
	c.JSON(200, gin.H{"id": user.ID, "name": user.Name, "email": user.Email, "role": user.Role, "token": tokenResponse.Token})
	return
}

func (e *Env) CreateUserRecord(givenUser models.User) error {
	_, err := e.DB.Model(&givenUser).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_pk\"") {
			return models.ErrUserAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) ResetPassword(c *gin.Context) {
	var payload ResetPayload
	var user models.User
	err := c.ShouldBindJSON(&payload)
	if err != nil || payload.Email == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}
	err = e.DB.Model(&user).
		Where("email = ?", payload.Email).
		Select()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}
	err = e.resetUserPassword(&user)
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "error while resetting password",
		})
		c.Abort()
		return
	}
	err = e.updateUserRecord(&user)
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "error while updating password",
		})
		c.Abort()
		return
	}

	c.Done()
	return
}

func (e *Env) updateUserRecord(user *models.User) error {
	_, err := e.DB.Model(user).
		Set("password = ?", user.Password).
		WherePK().
		Update()

	if err != nil {
		return err
	}
	return nil
}

func (e *Env) sendEmail(emailType string, email string, password string) error {
	from := "extranetthamiris@gmail.com"
	pass := "Ch0c0l4t3!!"
	to := email
	var body = ""
	var msg = ""
	switch emailType {
	case "password reset":
		body = "Olá,\n Logue com a senha a seguir na Extranet:\n" + password
		msg = "Subject: Reset de Senha\n\n"
	case "signup":
		body = "Olá,\n Seja muito bem-vindo/a/e à Extranet! \n Logue com os dados a seguir: \n Usuário: " + email + "\n Senha: " + password
		msg = "Subject: Suas credenciais de acesso à Extranet\n\n"
	}

	msgToBeSent := "From: " + from + "\n" +
		"To: " + to + "\n" + msg + body
	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msgToBeSent))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return err
	}
	return nil
}

func (e *Env) resetUserPassword(user *models.User) error {
	newPassword := e.generateRandomPassword()
	err := e.sendEmail("password reset", user.Email, newPassword)
	if err != nil {
		return err
	}
	err = user.HashPassword(newPassword)
	if err != nil {
		return err
	}
	return nil
}

func (e *Env) generateRandomPassword() string {
	rand.Seed(time.Now().UnixNano())
	chars := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ" +
		"abcdefghijklmnopqrstuvwxyzåäö" +
		"0123456789")
	length := 8
	var b strings.Builder
	for i := 0; i < length; i++ {
		b.WriteRune(chars[rand.Intn(len(chars))])
	}
	return b.String()
}

// ************ NOTICIAS ************ //
