package app

import (
	"github.com/GodwinJacobR/go-todo-app/internal/db"
)

type App struct {
	db *db.Db
}

func New() *App {
	db, err := db.New()
	if err != nil {
		return nil
	}

	// Initialize server
	return &App{
		db: db,
	}
}

func (a *App) Start() error {
	return nil
}
