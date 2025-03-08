package track_user

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
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
	Type    string       `json:"type"`
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
			http.Error(w, "Error upgrading to WebSocket", http.StatusBadRequest)
			return
		}

		client := &Client{
			UserID: userID,
			Send:   make(chan UserPosition, 256),
		}

		h.register <- client

		go writePump(conn, client)
		go readPump(conn, client, h)
	}
}

func readPump(conn *websocket.Conn, client *Client, h *handler) {
	defer func() {
		h.unregister <- client
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
			break
		}

		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Error parsing message: %v", err)
			continue
		}

		if msg.Type == "position_update" {
			msg.Payload.UserID = client.UserID
			msg.Payload.Timestamp = time.Now()

			if err := h.updateUserPosition(context.Background(), msg.Payload); err != nil {
				log.Printf("Error updating position: %v", err)
			}
		}
	}
}

func writePump(conn *websocket.Conn, client *Client) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		conn.Close()
	}()

	for {
		select {
		case position, ok := <-client.Send:
			conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			msg := Message{
				Type:    "position_update",
				Payload: position,
			}

			if err := conn.WriteJSON(msg); err != nil {
				return
			}

		case <-ticker.C:
			conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
