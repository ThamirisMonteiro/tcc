package main

import (
	"extranet/controllers"
	"extranet/middlewares"
	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	cors "github.com/rs/cors/wrapper/gin"
	"log"
)

var (
	url = "postgres://tham:1234@localhost:5432/postgres?sslmode=disable"
)

func main() {
	db, err := connectToDatabase(url)
	if err != nil {
		log.Fatalln("could not create database", err)
	}

	env := controllers.Env{DB: db}

	r := setupRouter(env)

	err = r.Run(":8080")
	if err != nil {
		log.Fatalln("could not run database", err)
	}
}

func connectToDatabase(url string) (*pg.DB, error) {
	opt, err := pg.ParseURL(url)
	if err != nil {
		return nil, err
	}
	db := pg.Connect(opt)
	return db, nil
}

func setupRouter(env controllers.Env) *gin.Engine {
	r := gin.Default()

	r.Use(cors.AllowAll())

	api := r.Group("/api")
	{
		public := api.Group("/public")
		{
			public.POST("/login", env.Login)
			public.POST("/signup", env.Signup)
			public.POST("/resetpassword", env.ResetPassword)
		}
		protected := api.Group("/protected").Use(middlewares.Authz())
		{
			// users
			protected.POST("/userbyemail", env.GetUserByEmail)
			protected.POST("/changepassword", env.ChangePassword)
			protected.PUT("/users/:email", env.UpdateUser)
			protected.GET("/users", env.GetAllUsers)

			// noticias
			protected.POST("/noticiabyaddress", env.GetNoticiaByAddress)
			protected.PUT("/noticias/:address", env.UpdateNoticia)
			protected.GET("/noticias", env.GetAllNoticias)
			protected.POST("/createnoticia", env.CreateNoticia)

			// galerias
			protected.GET("/galerias", env.GetAllGalerias)
			protected.POST("/creategaleria", env.CreateGaleria)
			protected.POST("/galeriabyname", env.GetGaleriaByName)
			protected.PUT("/galerias/:name", env.UpdateGaleria)

			// fotos
			protected.POST("/uploadfoto", env.UploadFoto)
			protected.POST("/fotosbygaleria", env.GetFotosByGaleria)
			protected.PUT("/inativarfotos", env.InativarFotos)
		}
	}
	return r
}
