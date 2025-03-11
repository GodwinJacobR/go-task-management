package http

import (
	"context"
	"fmt"
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
			Addr:    net.JoinHostPort("0.0.0.0", "8080"), // TODO get from config
		},
	}
}

func (s *HttpServer) Start() error {
	fmt.Printf("Starting HTTP server on: 0.0.0.0:8080\n")
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
