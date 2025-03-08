package app

import (
	"errors"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/db"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/features/add_task"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/features/convert_to_subtask"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/features/get_tasks"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/features/promote_task"
	"github.com/GodwinJacobR/go-todo-app/backend/internal/features/toggle_completion"
	"github.com/gorilla/mux"
)

type App struct {
	db     *db.Db
	router *mux.Router
}

func New() *App {
	db, err := db.New()
	if err != nil {
		panic(err)
	}

	return &App{
		db:     db,
		router: mux.NewRouter(),
	}
}

func (a *App) Start() error {
	return errors.Join(
		a.db.Migrate(),
		a.setupFeatures(),
	)
}

func (a *App) setupFeatures() error {
	return errors.Join(
		get_tasks.Setup(a.router, a.db.GetDB()),
		add_task.Setup(a.router, a.db.GetDB()),
		convert_to_subtask.Setup(a.router, a.db.GetDB()),
		promote_task.Setup(a.router, a.db.GetDB()),
		toggle_completion.Setup(a.router, a.db.GetDB()),
	)
}

func (a *App) Stop() error {
	return errors.Join(
		a.db.Close(),
	)
}

func (a *App) GetRouter() *mux.Router {
	return a.router
}
