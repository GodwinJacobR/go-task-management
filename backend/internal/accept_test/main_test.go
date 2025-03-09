package accept_test

import (
	"os"
	"testing"
	"time"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/server"
)

const serverURL = "http://localhost:3001"

func TestMain(m *testing.M) {

	server.Init()

	time.Sleep(2 * time.Second)

	os.Exit(m.Run())
}
