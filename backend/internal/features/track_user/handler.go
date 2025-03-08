package track_user

import (
	"context"
	"sync"
	"time"
)

// UserPosition represents a user's position data
type UserPosition struct {
	UserID    string    `json:"userId"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Timestamp time.Time `json:"timestamp"`
}

// Client represents a connected WebSocket client
type Client struct {
	UserID string
	Send   chan UserPosition
}

// handler manages the WebSocket connections and user positions
type handler struct {
	clients       map[*Client]bool
	broadcast     chan UserPosition
	register      chan *Client
	unregister    chan *Client
	positionStore map[string]UserPosition // Store latest position by userID
	mu            sync.RWMutex            // Mutex for thread-safe access to maps
}

// NewHandler creates a new handler instance
func NewHandler() *handler {
	h := &handler{
		clients:       make(map[*Client]bool),
		broadcast:     make(chan UserPosition),
		register:      make(chan *Client),
		unregister:    make(chan *Client),
		positionStore: make(map[string]UserPosition),
	}

	// Start the handler's goroutines
	go h.run()

	return h
}

// run processes WebSocket events in a separate goroutine
func (h *handler) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

			// Send current positions to newly connected client
			h.mu.RLock()
			for _, pos := range h.positionStore {
				select {
				case client.Send <- pos:
				default:
					// Skip if client's buffer is full
				}
			}
			h.mu.RUnlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
			h.mu.Unlock()

		case position := <-h.broadcast:
			// Store the latest position in memory
			h.mu.Lock()
			h.positionStore[position.UserID] = position
			h.mu.Unlock()

			// Broadcast to all clients
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.Send <- position:
				default:
					// If client's buffer is full, unregister the client
					h.mu.RUnlock()
					h.mu.Lock()
					delete(h.clients, client)
					close(client.Send)
					h.mu.Unlock()
					h.mu.RLock()
				}
			}
			h.mu.RUnlock()
		}
	}
}

// updateUserPosition updates a user's position and broadcasts it to all clients
func (h *handler) updateUserPosition(ctx context.Context, position UserPosition) error {
	// Broadcast to all connected clients
	h.broadcast <- position

	return nil
}

// getUserPositions retrieves all user positions from memory
func (h *handler) getUserPositions() []UserPosition {
	h.mu.RLock()
	defer h.mu.RUnlock()

	positions := make([]UserPosition, 0, len(h.positionStore))
	for _, pos := range h.positionStore {
		positions = append(positions, pos)
	}

	return positions
}

// getUserPosition retrieves a specific user's position from memory
func (h *handler) getUserPosition(userID string) (UserPosition, bool) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	position, exists := h.positionStore[userID]
	return position, exists
}
