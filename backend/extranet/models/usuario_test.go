package models

import (
	"extranet/core/id"
	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestUser_HashPassword_WhenUserIsValid_ShouldHasPasswordSuccessfully(t *testing.T) {
	// Arrange
	user := User{
		ID:       id.New(),
		Name:     "new user",
		Email:    "user@user.com",
		Password: "password",
		Role:     "user",
	}

	// Act
	err := user.HashPassword(user.Password)

	// Assert
	require.NoError(t, err)
}

func TestUser_CheckPassword_WhenHashIsInvalid_ShouldReturnError(t *testing.T) {
	// Arrange
	user := User{
		ID:       id.New(),
		Name:     "new user",
		Email:    "user@user.com",
		Password: "password",
		Role:     "user",
	}

	// Act
	err := user.CheckPassword("")

	// Assert
	assert.Equal(t, "crypto/bcrypt: hashedSecret too short to be a bcrypted password", err.Error())
}

func TestUser_CheckPassword_WhenHashIsFromAnotherPassword_ShouldReturnError(t *testing.T) {
	// Arrange
	user := User{
		ID:       id.New(),
		Name:     "new user",
		Email:    "user@user.com",
		Password: "password",
		Role:     "user",
	}
	err := user.HashPassword(user.Password)

	// Act
	err = user.CheckPassword("newpassword")

	// Assert
	assert.Equal(t, "crypto/bcrypt: hashedPassword is not the hash of the given password", err.Error())
}
