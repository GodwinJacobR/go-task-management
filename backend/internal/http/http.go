package http

import (
	"context"
	"net"
	"net/http"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/http/middlewares"
	"github.com/gorilla/mux"
)

type HttpServer struct {
	inner *http.Server
}

func New(router *mux.Router) *HttpServer {
	router.Use(middlewares.CorsMiddleware)

	return &HttpServer{
		inner: &http.Server{
			Handler: router,
			Addr:    net.JoinHostPort("localhost", "3001"), // TODO get from config
		},
	}
}

func (s *HttpServer) Start() error {
	go func() {
		if err := s.inner.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()
	return nil
}

func (s *HttpServer) Shutdown(ctx context.Context) error {
	return s.inner.Shutdown(ctx)
}
