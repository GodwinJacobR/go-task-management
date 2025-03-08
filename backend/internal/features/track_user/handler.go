package track_user

import (
	"context"
	"sync"
	"time"
)

type UserPosition struct {
	UserID    string    `json:"userId"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Timestamp time.Time `json:"timestamp"`
}

type Client struct {
	UserID string
	Send   func(position UserPosition)
}

type handler struct {
	clients       map[*Client]bool
	positionStore map[string]UserPosition
	mu            sync.RWMutex
}

func NewHandler() *handler {
	return &handler{
		clients:       make(map[*Client]bool),
		positionStore: make(map[string]UserPosition),
	}
}

func (h *handler) registerClient(client *Client) {
	h.mu.Lock()
	h.clients[client] = true
	h.mu.Unlock()

	h.mu.RLock()
	for _, pos := range h.positionStore {
		client.Send(pos)
	}
	h.mu.RUnlock()
}

func (h *handler) unregisterClient(client *Client) {
	h.mu.Lock()
	delete(h.clients, client)
	h.mu.Unlock()
}

func (h *handler) updateUserPosition(ctx context.Context, position UserPosition) {
	h.mu.Lock()
	h.positionStore[position.UserID] = position
	h.mu.Unlock()

	h.broadcast(position)
}

func (h *handler) broadcast(position UserPosition) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.clients {
		go client.Send(position)
	}
}

func (h *handler) getUserPositions() []UserPosition {
	h.mu.RLock()
	defer h.mu.RUnlock()

	positions := make([]UserPosition, 0, len(h.positionStore))
	for _, pos := range h.positionStore {
		positions = append(positions, pos)
	}

	return positions
}

func (h *handler) getUserPosition(userID string) (UserPosition, bool) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	position, exists := h.positionStore[userID]
	return position, exists
}
