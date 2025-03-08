package track_user

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// WebSocket upgrader with CORS support
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins in development
		return true
	},
}

func Setup(r *mux.Router) error {
	// Create handler
	h := NewHandler()

	// WebSocket endpoint for tracking user positions
	// This is the only endpoint we need - all position updates and tracking
	// will be handled through the WebSocket connection
	r.HandleFunc("/ws/track", wsHandler(h)).Methods(http.MethodGet)

	return nil
}
