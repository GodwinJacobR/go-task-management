// WebSocket service for real-time mouse position tracking
import { v4 as uuidv4 } from 'uuid';

// Define the structure of user position data to match the backend
export interface UserPosition {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

// Define the message structure for WebSocket communication
interface WebSocketMessage {
  payload: UserPosition;
}

// WebSocket connection status
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

// WebSocket service class
export class MouseTrackingService {
  private socket: WebSocket | null = null;
  private userId: string;
  private listeners: ((positions: UserPosition[]) => void)[] = [];
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];
  private userPositions: Map<string, UserPosition> = new Map();
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private createdAt: Date;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number | null = null;

  constructor() {
    // Generate a new unique user ID for each session
    this.userId = uuidv4();
    console.log('Generated new user ID for this session:', this.userId);
    
    // Store the timestamp when this instance was created
    this.createdAt = new Date();
    console.log('MouseTrackingService instance created at:', this.createdAt);
  }

  // Connect to the WebSocket server
  public connect(): void {
    if (this.socket) {
      return;
    }

    this.updateStatus(ConnectionStatus.CONNECTING);
    
    // For development, use localhost if hostname is localhost
    const hostname = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
    const port = 3001; // Backend WebSocket server port
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${hostname}:${port}/ws/track?user_id=${this.userId}`;
    
    console.log('Connecting to WebSocket at:', wsUrl);
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.updateStatus(ConnectionStatus.ERROR);
      this.attemptReconnect();
    }
  }

  // Handle WebSocket open event
  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.updateStatus(ConnectionStatus.CONNECTED);
    this.reconnectAttempts = 0;
    
    // Send initial position to announce presence
    const initialPosition = {
      latitude: 0,
      longitude: 0
    };
    this.sendMousePosition(initialPosition.longitude, initialPosition.latitude);
  }

  // Handle WebSocket close event
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed with code:', event.code, 'reason:', event.reason);
    this.updateStatus(ConnectionStatus.DISCONNECTED);
    this.socket = null;
    
    // Attempt to reconnect
    this.attemptReconnect();
  }

  // Handle WebSocket error event
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.updateStatus(ConnectionStatus.ERROR);
  }

  // Handle WebSocket message event
  private handleMessage(event: MessageEvent): void {
    try {
      console.log('Received WebSocket message:', event.data);
      const message: WebSocketMessage = JSON.parse(event.data);
      const position = message.payload;
      
      // Update the position with the timestamp
      position.timestamp = new Date(position.timestamp);
      
      // Store the position
      this.userPositions.set(position.userId, position);
      console.log('Updated positions map, now tracking', this.userPositions.size, 'users');
      
      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Attempt to reconnect to the WebSocket server
  private attemptReconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached. Please refresh the page.');
    }
  }

  // Disconnect from the WebSocket server
  public disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.updateStatus(ConnectionStatus.DISCONNECTED);
    }
  }

  // Send the current mouse position to the server
  // Convert screen coordinates to latitude/longitude format
  public sendMousePosition(x: number, y: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Convert screen coordinates to latitude/longitude format
      // For simplicity, we're using the screen coordinates directly
      // In a real app, you might want to normalize these values
      const position: UserPosition = {
        userId: this.userId,
        latitude: y,  // Using y as latitude
        longitude: x, // Using x as longitude
        timestamp: new Date()
      };
      
      const message: WebSocketMessage = {
        payload: position
      };
      
      this.socket.send(JSON.stringify(message));
    } else if (this.socket) {
      console.log('Cannot send position, WebSocket state:', this.socket.readyState);
    } else {
      console.log('Cannot send position, WebSocket not initialized');
    }
  }

  // Get all current user positions
  public getAllPositions(): UserPosition[] {
    return Array.from(this.userPositions.values());
  }

  // Get the current user's ID
  public getUserId(): string {
    return this.userId;
  }

  // Get the current connection status
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Add a listener for position updates
  public addPositionListener(listener: (positions: UserPosition[]) => void): void {
    this.listeners.push(listener);
    // Immediately notify with current positions
    listener(this.getAllPositions());
  }

  // Remove a position listener
  public removePositionListener(listener: (positions: UserPosition[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Add a listener for connection status updates
  public addStatusListener(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.push(listener);
    // Immediately notify with current status
    listener(this.connectionStatus);
  }

  // Remove a status listener
  public removeStatusListener(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  // Update the connection status and notify listeners
  private updateStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  // Notify all position listeners
  private notifyListeners(): void {
    const positions = this.getAllPositions();
    this.listeners.forEach(listener => listener(positions));
  }
}

// Create a factory function to get a new instance for each tab
// This ensures a new user ID is generated for each browser tab
let serviceInstance: MouseTrackingService | null = null;

export function getMouseTrackingService(): MouseTrackingService {
  if (!serviceInstance) {
    serviceInstance = new MouseTrackingService();
    
    // Clear the instance when the tab is closed or refreshed
    window.addEventListener('beforeunload', () => {
      if (serviceInstance) {
        serviceInstance.disconnect();
        serviceInstance = null;
      }
    });
  }
  
  return serviceInstance;
}

// For backward compatibility
const mouseTrackingService = getMouseTrackingService();
export default mouseTrackingService; 