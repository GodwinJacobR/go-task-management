package track_user

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Message struct {
	Payload UserPosition `json:"payload"`
}

func wsHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "User ID is required", http.StatusBadRequest)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("Error upgrading to WebSocket: %v", err)
			return
		}

		var writeMu sync.Mutex

		client := &Client{
			UserID: userID,
			Send: func(position UserPosition) {
				writeMu.Lock()
				defer writeMu.Unlock()

				msg := Message{
					Payload: position,
				}

				conn.SetWriteDeadline(time.Now().Add(writeWait))

				if err := conn.WriteJSON(msg); err != nil {
					log.Printf("Error writing to WebSocket: %v", err)
				}
			},
		}

		h.registerClient(client)

		readMessages(conn, client, h)
	}
}

func readMessages(conn *websocket.Conn, client *Client, h *handler) {
	defer func() {
		h.unregisterClient(client)
		conn.Close()
	}()

	conn.SetReadLimit(maxMessageSize)
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket error: %v", err)
			break
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Error parsing message: %v", err)
			continue
		}

		msg.Payload.UserID = client.UserID
		msg.Payload.Timestamp = time.Now()

		h.updateUserPosition(context.Background(), msg.Payload)
	}
}
