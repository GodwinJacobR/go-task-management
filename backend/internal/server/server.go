package server

import (
	"github.com/GodwinJacobR/go-todo-app/backend/internal/app"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/http"
)

type Component interface {
	Start() error
}

func Init() {
	app := app.New()
	components := []Component{
		app,
		http.New(app.GetRouter()),
	}
	for _, component := range components {
		if err := component.Start(); err != nil {
			panic(err)
		}
	}
}
