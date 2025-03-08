package track_user

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Setup(r *mux.Router) error {
	h := NewHandler()

	r.HandleFunc("/ws/track", wsHandler(h)).Methods(http.MethodGet)
	return nil
}
