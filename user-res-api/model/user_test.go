package model

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateUser(t *testing.T) {
	// Configurar el assert
	assert := assert.New(t)

	// Crear valores de prueba para user
	user := User{
		Id:       1,
		Name:     "Josefina",
		LastName: "Rivero",
		UserName: "josefinarivero",
		Phone:    3514,
		Address:  "Pachacutec 43",
		Password: "hola",
		Email:    "jose@",
		Type:     true,
	}

	// Verificar que Id de user
	assert.Equal(1, user.Id, "El ID del user no coincide")
	// Verificar que nombre de user
	assert.Equal("Josefina", user.Name, "El nombre del user no coincide")
	// Verificar apellido
	assert.Equal("Rivero", user.LastName, "El apellido del user no coincide")
	// Verificar que username de user
	assert.Equal("josefinarivero", user.UserName, "El username del user no coincide")
	// Verificar que phone de user
	assert.Equal(3514, user.Phone, "El phone del user no coincide")
	// Verificar que address de user
	assert.Equal("Pachacutec 43", user.Address, "El address del user no coincide")
	// Verificar que password de user
	assert.Equal("hola", user.Password, "El password del user no coincide")
	// Verificar que mail de user
	assert.Equal("jose@", user.Email, "El email del user no coincide")
	// Verificar que type de user
	assert.Equal(true, user.Type, "El type del user no coincide")

}
