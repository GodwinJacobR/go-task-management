package server

import (
	"github.com/GodwinJacobR/go-todo-app/internal/app"
	"github.com/GodwinJacobR/go-todo-app/internal/http"
)

type Component interface {
	Start() error
}

func Init() {
	components := []Component{
		app.New(),
		http.New(),
	}
	for _, component := range components {
		if err := component.Start(); err != nil {
			panic(err)
		}
	}
}
