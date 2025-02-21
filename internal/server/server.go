package server

import (
	"context"
	"net/http"

	"github.com/GodwinJacobR/go-todo-app/internal/db"
)

type Server struct {
	srv *http.Server
	db  *db.Db
}

func New(cfg config.ServerConfig, db *db.Db) (*Server, error) {
	return &Server{
		srv: &http.Server{
			Addr: cfg.Port,
		},
		db: db,
	}, nil
}

func (s *Server) Start(ctx context.Context) error {
	go func() {
		if err := s.srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()
	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.srv.Shutdown(ctx)
}
