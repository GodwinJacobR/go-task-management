package app

import (
	"context"

	"github.com/GodwinJacobR/go-todo-app/internal/db"
	"github.com/GodwinJacobR/go-todo-app/internal/server"
)

type App struct {
	db *db.Db
}

func New() (*App, error) {
	// Load config

	// Initialize database
	db, err := db.New()
	if err != nil {
		return nil, err
	}

	// Initialize server
	server, err := server.New(cfg.Server, db)
	if err != nil {
		return nil, err
	}

	return &App{
		db:     db,
		server: server,
	}, nil
}

func (a *App) Start(ctx context.Context) error {
	// Start server
	if err := a.server.Start(ctx); err != nil {
		return err
	}

	return nil
}

func (a *App) Shutdown(ctx context.Context) error {
	// Shutdown in reverse order
	if err := a.server.Shutdown(ctx); err != nil {
		return err
	}

	if err := a.db.Close(); err != nil {
		return err
	}

	return nil
}
