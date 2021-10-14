package auth

import (
	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestJwtWrapper_GenerateToken_WhenEmailIsEmpty_ShouldGenerateTokenSuccessfully(t *testing.T) {
	// Arrange
	jwt := JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// Act
	token, err := jwt.GenerateToken("")

	// Assert
	require.NoError(t, err)
	assert.NotEqual(t, "", token)
}

func TestJwtWrapper_GenerateToken_WhenEmailIsValid_ShouldGenerateTokenSuccessfully(t *testing.T) {
	// Arrange
	jwt := JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// Act
	token, err := jwt.GenerateToken("thamirismylius@gmail.com")

	// Assert
	require.NoError(t, err)
	assert.NotEqual(t, "", token)
}

func TestJwtWrapper_ValidateToken_WhenTokenIsInValid_ShouldReturnError(t *testing.T) {
	// Arrange
	jwt := JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// Act
	_, err := jwt.ValidateToken("")

	// Assert
	assert.Equal(t, "token contains an invalid number of segments", err.Error())
}

func TestJwtWrapper_ValidateToken_WhenTokenIsValid_ShouldValidateSuccessfully(t *testing.T) {
	// Arrange
	jwt := JwtWrapper{
		SecretKey:       "verysecretkey",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}
	token, err := jwt.GenerateToken("")
	require.NoError(t, err)

	// Act
	_, err = jwt.ValidateToken(token)

	// Assert
	require.NoError(t, err)
}
