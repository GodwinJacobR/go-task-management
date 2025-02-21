package http

import (
	"context"
	"net/http"
)

type HttpServer struct {
	inner *http.Server
}

func New() *HttpServer {
	return &HttpServer{
		inner: &http.Server{
			Addr: "3000", // TODO get from config
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
