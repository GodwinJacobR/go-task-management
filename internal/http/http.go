package http

import (
	"context"
	"net"
	"net/http"

	"github.com/gorilla/mux"
)

type HttpServer struct {
	inner *http.Server
}

func New(router *mux.Router) *HttpServer {
	return &HttpServer{
		inner: &http.Server{
			Handler: router,
			Addr:    net.JoinHostPort("localhost", "3000"), // TODO get from config
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
