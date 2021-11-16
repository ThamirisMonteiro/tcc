package controllers

import (
	"errors"
	"extranet/core"
	"extranet/core/id"
	"extranet/models"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"log"
	"strconv"
	"strings"
)

func (e *Env) GetUserByID(c *gin.Context) {
	givenID := id.ID(c.Param("id"))
	var users []models.User
	var returnUser models.ReturnUser
	err := e.DB.Model(&users).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "user not found",
		})
		c.Abort()
		return
	}
	for _, user := range users {
		if user.ID == givenID {
			user.Password = ""
			job, err := e.GetCargoByID(user.JobTitleID)
			if err != nil {
				c.JSON(401, gin.H{
					"msg": "invalid input",
				})
				c.Abort()
				return
			}
			sector, err := e.GetSetorByID(user.SectorID)
			if err != nil {
				c.JSON(401, gin.H{
					"msg": "invalid input",
				})
				c.Abort()
				return
			}
			returnUser.JobTitle = job
			returnUser.Gender = user.Gender
			returnUser.CPF = user.CPF
			returnUser.Role = user.Role
			returnUser.AdmissionDate = user.AdmissionDate
			returnUser.DateOfBirth = user.DateOfBirth
			returnUser.Surname = user.Surname
			returnUser.Name = user.Name
			returnUser.Sector = sector
			returnUser.Email = user.Email
			returnUser.ID = user.ID
			returnUser.Active = user.Active
			c.JSON(200, returnUser)
			return
		}
	}
	c.JSON(404, gin.H{
		"msg": "user not found",
	})
	c.Abort()
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
		Set("sector_id = ? ", payload.SectorID).
		Set("gender = ? ", payload.Gender).
		Set("job_title_id = ? ", payload.JobTitleID).
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
		job, err := e.GetCargoByID(user.JobTitleID)
		if err != nil {
			c.JSON(401, gin.H{
				"msg": "invalid input",
			})
			c.Abort()
			return
		}
		setor, err := e.GetSetorByID(user.SectorID)
		if err != nil {
			c.JSON(401, gin.H{
				"msg": "invalid input",
			})
			c.Abort()
			return
		}
		givenUser.JobTitle = job
		givenUser.Gender = user.Gender
		givenUser.Surname = user.Surname
		givenUser.Name = user.Name
		givenUser.Sector = setor
		givenUser.Email = user.Email
		givenUser.Active = user.Active
		givenUser.ID = user.ID
		givenUsers = append(givenUsers, givenUser)
	}
	c.JSON(200, givenUsers)
	return
}

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

func (e *Env) GetAllCardapios(c *gin.Context) {
	var cardapios []models.Cardapio
	err := e.DB.Model(&cardapios).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "cardapios not found",
		})
		c.Abort()
		return
	}
	var givenCardapios []models.ReturnCardapio
	var givenCardapio models.ReturnCardapio
	for _, cardapio := range cardapios {
		givenCardapio.ID = cardapio.ID
		givenCardapio.Name = cardapio.Name
		givenCardapio.Day = cardapio.Day
		givenCardapio.Carboidrato = cardapio.Carboidrato
		givenCardapio.Proteina = cardapio.Proteina
		givenCardapio.Salada = cardapio.Salada
		givenCardapio.Legume = cardapio.Legume
		givenCardapio.Grao = cardapio.Grao
		givenCardapio.Carboidrato = cardapio.Carboidrato
		givenCardapio.Molho = cardapio.Molho
		givenCardapio.Suco = cardapio.Suco
		givenCardapio.Sobremesa = cardapio.Sobremesa
		givenCardapio.Active = cardapio.Active
		givenCardapios = append(givenCardapios, givenCardapio)
	}
	c.JSON(200, givenCardapios)
	return
}

func (e *Env) CreateCardapio(c *gin.Context) {
	var cardapio models.Cardapio
	err := c.ShouldBindJSON(&cardapio)
	if err != nil ||
		cardapio.Name == "" ||
		cardapio.Day == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	cardapio.Active = true
	cardapio.ID = id.New()

	err = e.CreateCardapioRecord(cardapio)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "cardapio created successfully"})
}

func (e *Env) CreateCardapioRecord(givenCardapio models.Cardapio) error {
	_, err := e.DB.Model(&givenCardapio).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) UpdateCardapio(c *gin.Context) {
	givenName := c.Param("name")
	var payload models.UpdateCardapioPayload
	var cardapio models.Cardapio
	err := c.ShouldBindJSON(&payload)
	if err != nil || payload.Day == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&cardapio).
		Where("name = ?", givenName).
		Set("active = ? ", payload.Active).
		Set("day = ? ", payload.Day).
		Set("carboidrato = ? ", payload.Carboidrato).
		Set("proteina = ? ", payload.Proteina).
		Set("salada = ? ", payload.Salada).
		Set("legume = ? ", payload.Legume).
		Set("molho = ? ", payload.Molho).
		Set("grao = ? ", payload.Grao).
		Set("suco = ? ", payload.Suco).
		Set("sobremesa = ? ", payload.Sobremesa).
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetCardapioByName(c *gin.Context) {
	var cardapioName models.PayloadName
	err := c.ShouldBindJSON(&cardapioName)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}
	var cardapio models.Cardapio
	err = e.DB.Model(&cardapio).
		Where("name = ?", cardapioName.Name).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "cardapio not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, cardapio)
	return
}

func (e *Env) GetAllServicos(c *gin.Context) {
	var servicos []models.Servico
	var servicosSolicitados []models.ServicoSolicitado
	err := e.DB.Model(&servicos).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "servicos not found",
		})
		c.Abort()
		return
	}
	var givenServicos []models.ReturnServico
	var givenServico models.ReturnServico
	for _, servico := range servicos {
		givenServico.ID = servico.ID
		givenServico.Name = servico.Name
		givenServico.Category = servico.Category
		givenServico.Active = servico.Active
		err := e.DB.Model(&servicosSolicitados).
			Where("service_id = ?", servico.ID).
			Select()
		if err != nil {
			c.JSON(404, gin.H{
				"msg": "servicos solicitados not found",
			})
			c.Abort()
			return
		}
		givenServico.Quantity = strconv.Itoa(len(servicosSolicitados))
		givenServicos = append(givenServicos, givenServico)
	}
	c.JSON(200, givenServicos)
	return
}

func (e *Env) GetAllServicosSolicitadosByUser(c *gin.Context) {
	var servicoUser models.PayloadUser
	err := c.ShouldBindJSON(&servicoUser)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}
	var servicosSolicitados []models.ServicoSolicitado
	err = e.DB.Model(&servicosSolicitados).
		Where("user_id = ?", servicoUser.UserID).Select()
	if err != nil {
		if err != pg.ErrNoRows {
			c.JSON(404, gin.H{
				"msg": "servicos solicitados not found",
			})
			c.Abort()
			return
		}
	}
	var servico models.Servico
	var resultServicoSolicitado models.ReturnServicoSolicitado
	var resultServicosSolicitados []models.ReturnServicoSolicitado
	for _, servicoSolicitado := range servicosSolicitados {
		err := e.DB.Model(&servico).Where("id = ?", servicoSolicitado.ServiceID).Select()
		if err != nil {
			c.JSON(404, gin.H{
				"msg": "servico not found",
			})
			c.Abort()
			return
		}
		resultServicoSolicitado.Name = servico.Name
		resultServicoSolicitado.Sector = servico.ResponsibleSector
		resultServicoSolicitado.Status = servicoSolicitado.Status
		resultServicoSolicitado.CreatedDate = servicoSolicitado.CreatedDate
		resultServicoSolicitado.Category = servico.Category
		resultServicoSolicitado.Description = servicoSolicitado.Description
		resultServicosSolicitados = append(resultServicosSolicitados, resultServicoSolicitado)
	}
	c.JSON(200, resultServicosSolicitados)
	return
}

func (e *Env) CreateServico(c *gin.Context) {
	var servico models.Servico
	err := c.ShouldBindJSON(&servico)
	if err != nil ||
		servico.Name == "" ||
		servico.Category == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	servico.Active = true
	servico.ID = id.New()

	err = e.CreateServicoRecord(servico)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "servico created successfully"})
}

func (e *Env) SolicitarServico(c *gin.Context) {
	var servicoSolicitado models.ServicoSolicitadoJSON
	err := c.ShouldBindJSON(&servicoSolicitado)
	if err != nil {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}
	clock := core.NewSystemClock()

	var servico models.Servico
	err = e.DB.Model(&servico).
		Where("category = ?", servicoSolicitado.Category).
		Where("name = ?", servicoSolicitado.Name).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "servico not found",
		})
		c.Abort()
		return
	}

	var resultServicoSolicitado models.ServicoSolicitado

	resultServicoSolicitado.ID = id.New()
	resultServicoSolicitado.Description = servicoSolicitado.Description
	resultServicoSolicitado.CreatedDate = clock.TodayAtBrazil().String()
	resultServicoSolicitado.Status = "criado"
	resultServicoSolicitado.ServiceID = servico.ID
	resultServicoSolicitado.UserID = servicoSolicitado.UserID

	err = e.CreateServicoSolicitadoRecord(resultServicoSolicitado)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{
			"msg": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{"msg": "solicitacao created successfully"})
}

func (e *Env) CreateServicoRecord(givenServico models.Servico) error {
	_, err := e.DB.Model(&givenServico).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) CreateServicoSolicitadoRecord(givenServico models.ServicoSolicitado) error {
	_, err := e.DB.Model(&givenServico).Insert()
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint \"users_email_uindex\"") {
			return models.ErrEmailAlreadyExists
		}
		return err
	}
	return nil
}

func (e *Env) UpdateServico(c *gin.Context) {
	givenName := c.Param("name")
	var payload models.UpdateServicoPayload
	var servico models.Servico
	err := c.ShouldBindJSON(&payload)
	if err != nil || payload.Category == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&servico).
		Where("name = ?", givenName).
		Set("active = ? ", payload.Active).
		Set("category = ? ", payload.Category).
		Set("responsible_sector = ? ", payload.ResponsibleSector).
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetServicoByName(c *gin.Context) {
	var servicoName models.PayloadName
	err := c.ShouldBindJSON(&servicoName)
	if err != nil {
		c.JSON(404, gin.H{
			"msg": err,
		})
		c.Abort()
		return
	}
	var servico models.Servico
	err = e.DB.Model(&servico).
		Where("name = ?", servicoName.Name).
		First()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "servico not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, servico)
	return
}

func (e *Env) UpdatePrevisaoDoTempo(c *gin.Context) {
	var previsao models.PrevisaoTempo
	err := c.ShouldBindJSON(&previsao)
	if err != nil || previsao.City == "" || previsao.Estate == "" {
		c.JSON(400, gin.H{
			"msg": "invalid json",
		})
		c.Abort()
		return
	}

	_, err = e.DB.Model(&previsao).
		Set("city = ? ", previsao.City).
		Set("estate = ? ", previsao.Estate).
		WherePK().
		Update()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
}

func (e *Env) GetPrevisaoDoTempo(c *gin.Context) {
	var previsao []models.PrevisaoTempo

	err := e.DB.Model(&previsao).Select()
	if err != nil {
		c.JSON(401, gin.H{
			"msg": "invalid input",
		})
		c.Abort()
		return
	}
	c.JSON(200, previsao[0])
	return
}

func (e *Env) GetCargoByID(givenID id.ID) (string, error) {
	var cargos []models.Cargo
	err := e.DB.Model(&cargos).Select()
	if err != nil {
		return "", errors.New("unable to find cargo")
	}
	for _, cargo := range cargos {
		if cargo.ID == givenID {
			return cargo.Name, nil
		}
	}
	return "", errors.New("unable to find cargo")
}

func (e *Env) GetAllCargos(c *gin.Context) {
	var cargos []models.Cargo
	err := e.DB.Model(&cargos).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "cargos not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, cargos)
	return
}

func (e *Env) GetSetorByID(givenID id.ID) (string, error) {
	var setores []models.Setor
	err := e.DB.Model(&setores).Select()
	if err != nil {
		return "", errors.New("unable to find setor")
	}
	for _, setor := range setores {
		if setor.ID == givenID {
			return setor.Name, nil
		}
	}
	return "", errors.New("unable to find setor")
}

func (e *Env) GetAllSetores(c *gin.Context) {
	var setores []models.Setor
	err := e.DB.Model(&setores).Select()
	if err != nil {
		c.JSON(404, gin.H{
			"msg": "setores not found",
		})
		c.Abort()
		return
	}
	c.JSON(200, setores)
	return
}
