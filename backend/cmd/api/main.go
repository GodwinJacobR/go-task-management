package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/server"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	server.Init()

	<-ctx.Done()
	// TODO graceful shutdown
}
