package controllers

import (
	"extranet/core/id"
	"extranet/models"
	"github.com/gin-gonic/gin"
	"log"
	"strings"
)

// ************ USUÁRIOS ************ //

func (e *Env) GetUserByEmail(c *gin.Context) {
	var user models.User
	email, _ := c.Get("email")
	err := e.DB.Model(&user).
		Where("email = ?", email.(string)).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "user not found",
		})
		c.Abort()
		return
	}
	user.Password = ""
	c.JSON(200, user)
	return
}

func (e *Env) ChangePassword(c *gin.Context) {
	var payload ChangePasswordPayload
	var user models.User
	err := c.ShouldBindJSON(&payload)
	if err != nil || payload.Email == "" || payload.OldPassword == "" || payload.NewPassword == "" {
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

	errPassword := user.CheckPassword(payload.OldPassword)
	if errPassword != nil {
		log.Println(err)
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}

	err = user.HashPassword(payload.NewPassword)
	if err != nil {
		log.Println(err.Error())
		c.JSON(500, gin.H{
			"msg": "error hashing password",
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

func (e *Env) UpdateUser(c *gin.Context) {
	givenEmail := c.Param("email")
	var payload models.UpdateUserPayload
	var user models.User
	err := c.ShouldBindJSON(&payload)
	if err != nil || givenEmail == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&user).
		Where("email = ?", givenEmail).
		Set("active = ? ", payload.Active).
		Set("name = ? ", payload.Name).
		Set("surname = ? ", payload.Surname).
		Set("sector = ? ", payload.Sector).
		Set("gender = ? ", payload.Gender).
		Set("job_title = ? ", payload.JobTitle).
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid user credentials",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetAllUsers(c *gin.Context) {
	var users []models.User
	err := e.DB.Model(&users).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "users not found",
		})
		c.Abort()
		return
	}
	var givenUsers []models.ReturnUser
	var givenUser models.ReturnUser
	for _, user := range users {
		givenUser.Gender = user.Gender
		givenUser.Surname = user.Surname
		givenUser.Name = user.Name
		givenUser.Sector = user.Sector
		givenUser.Email = user.Email
		givenUser.JobTitle = user.JobTitle
		givenUser.Active = user.Active
		givenUsers = append(givenUsers, givenUser)
	}
	c.JSON(200, givenUsers)
	return
}

// ************ NOTÍCIAS ************ //

func (e *Env) CreateNoticiaRecord(givenNoticia models.Noticia) error {
	_, err := e.DB.Model(&givenNoticia).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) UpdateNoticia(c *gin.Context) {
	givenAddress := c.Param("address")
	var payload models.UpdateNoticiaPayload
	var noticia models.Noticia
	err := c.ShouldBindJSON(&payload)
	if err != nil || givenAddress == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&noticia).
		Where("address = ?", givenAddress).
		Set("active = ? ", payload.Active).
		Set("title = ? ", payload.Title).
		Set("subtitle = ? ", payload.Subtitle).
		Set("category = ? ", payload.Category).
		Set("image = ? ", payload.Image).
		Set("text = ? ", payload.Text).
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetAllNoticias(c *gin.Context) {
	var noticias []models.Noticia
	err := e.DB.Model(&noticias).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "noticias not found",
		})
		c.Abort()
		return
	}
	var givenNoticias []models.ReturnNoticia
	var givenNoticia models.ReturnNoticia
	for _, noticia := range noticias {
		givenNoticia.ID = noticia.ID
		givenNoticia.Category = noticia.Category
		givenNoticia.Image = noticia.Image
		givenNoticia.Title = noticia.Title
		givenNoticia.Subtitle = noticia.Subtitle
		givenNoticia.Text = noticia.Text
		givenNoticia.Address = noticia.Address
		givenNoticia.Active = noticia.Active
		givenNoticias = append(givenNoticias, givenNoticia)
	}
	c.JSON(200, givenNoticias)
	return
}

func (e *Env) CreateNoticia(c *gin.Context) {
	var noticia models.Noticia
	err := c.ShouldBindJSON(&noticia)
	if err != nil ||
		noticia.Address == "" ||
		noticia.Image == "" ||
		noticia.Title == "" ||
		noticia.Subtitle == "" ||
		noticia.Category == "" ||
		noticia.Text == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	noticia.Active = true
	noticia.ID = id.New()

	err = e.CreateNoticiaRecord(noticia)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "noticia created successfully"})
}

func (e *Env) GetNoticiaByAddress(c *gin.Context) {
	var noticiaAddress models.PayloadAddress
	err := c.ShouldBindJSON(&noticiaAddress)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}
	var noticia models.Noticia
	err = e.DB.Model(&noticia).
		Where("address = ?", noticiaAddress.Address).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "noticia not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, noticia)
	return
}

// ************ GALERIAS ************ //

func (e *Env) GetAllGalerias(c *gin.Context) {
	var galerias []models.Galeria
	err := e.DB.Model(&galerias).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "galerias not found",
		})
		c.Abort()
		return
	}
	var givenGalerias []models.ReturnGaleria
	var givenGaleria models.ReturnGaleria
	for _, galeria := range galerias {
		givenGaleria.ID = galeria.ID
		givenGaleria.Name = galeria.Name
		givenGaleria.Description = galeria.Description
		givenGaleria.Date = galeria.Date
		givenGaleria.Category = galeria.Category
		givenGaleria.CoverImage = galeria.CoverImage
		givenGaleria.Active = galeria.Active
		givenGalerias = append(givenGalerias, givenGaleria)
	}
	c.JSON(200, givenGalerias)
	return
}

func (e *Env) CreateGaleria(c *gin.Context) {
	var galeria models.Galeria
	err := c.ShouldBindJSON(&galeria)
	if err != nil ||
		galeria.Name == "" ||
		galeria.Description == "" ||
		galeria.Date == "" ||
		galeria.CoverImage == "" ||
		galeria.Category == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	galeria.Active = true
	galeria.ID = id.New()

	err = e.CreateGaleriaRecord(galeria)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "galeria created successfully"})
}

func (e *Env) CreateGaleriaRecord(givenGaleria models.Galeria) error {
	_, err := e.DB.Model(&givenGaleria).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) UpdateGaleria(c *gin.Context) {
	givenName := c.Param("name")
	var payload models.UpdateGaleriaPayload
	var galeria models.Galeria
	err := c.ShouldBindJSON(&payload)
	if err != nil || givenName == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&galeria).
		Where("name = ?", givenName).
		Set("active = ? ", payload.Active).
		Set("name = ? ", payload.Name).
		Set("description = ? ", payload.Description).
		Set("date = ? ", payload.Date).
		Set("cover_image = ?", payload.CoverImage).
		Set("category = ? ", payload.Category).
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetGaleriaByName(c *gin.Context) {
	var galeriaName models.PayloadName
	err := c.ShouldBindJSON(&galeriaName)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}
	var galeria models.Galeria
	err = e.DB.Model(&galeria).
		Where("name = ?", galeriaName.Name).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "galeria not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, galeria)
	return
}

// ************ FOTOS ************ //

func (e *Env) UploadFoto(c *gin.Context) {
	var foto models.Foto
	err := c.ShouldBindJSON(&foto)
	if err != nil ||
		foto.Image == "" ||
		foto.Galeria == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	foto.Active = true
	foto.ID = id.New()

	err = e.CreateFotoRecord(foto)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "foto uploaded successfully"})
}

func (e *Env) CreateFotoRecord(givenFoto models.Foto) error {
	_, err := e.DB.Model(&givenFoto).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) GetFotosByGaleria(c *gin.Context) {
	var galeriaName models.PayloadName
	err := c.ShouldBindJSON(&galeriaName)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}

	var fotos []models.Foto
	err = e.DB.Model(&fotos).
		Where("galeria = ?", galeriaName.Name).
		Where("active = true").
		Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "fotos not found",
		})
		c.Abort()
		return
	}

	var givenFotos []models.ReturnFoto
	var givenFoto models.ReturnFoto
	for _, foto := range fotos {
		givenFoto.ID = foto.ID
		givenFoto.Image = foto.Image
		givenFoto.Galeria = foto.Galeria
		givenFoto.Active = foto.Active
		givenFotos = append(givenFotos, givenFoto)
	}

	c.JSON(200, givenFotos)
	return
}

func (e *Env) InativarFotos(c *gin.Context) {
	var givenFotosIDs models.InativarFoto
	var foto models.Foto
	err := c.ShouldBindJSON(&givenFotosIDs)
	if err != nil {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	for _, givenFotoID := range givenFotosIDs.IDs {
		foto.ID = id.ID(givenFotoID)
		_, err = e.DB.Model(&foto).
			WherePK().
			Set("active = false").
			Update()
		if err != nil {
			c.JSON(401, gin.H{
				"msg": "invalid input",
			})
			c.Abort()
			return
		}
	}
}
