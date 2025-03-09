
import { v4 as uuidv4 } from 'uuid';


export interface UserPosition {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}


interface WebSocketMessage {
  payload: UserPosition;
}


export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}


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
    
    this.userId = uuidv4();
    console.log('Generated new user ID for this session:', this.userId);
    
    
    this.createdAt = new Date();
    console.log('MouseTrackingService instance created at:', this.createdAt);
  }

  
  public connect(): void {
    if (this.socket) {
      return;
    }

    this.updateStatus(ConnectionStatus.CONNECTING);
    
    const wsUrl = `ws//localhost:3001/ws/track?user_id=${this.userId}`;

    
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

  
  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.updateStatus(ConnectionStatus.CONNECTED);
    this.reconnectAttempts = 0;
    
    
    const initialPosition = {
      latitude: 0,
      longitude: 0
    };
    this.sendMousePosition(initialPosition.longitude, initialPosition.latitude);
  }

  
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed with code:', event.code, 'reason:', event.reason);
    this.updateStatus(ConnectionStatus.DISCONNECTED);
    this.socket = null;
    
    
    this.attemptReconnect();
  }

  
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.updateStatus(ConnectionStatus.ERROR);
  }

  
  private handleMessage(event: MessageEvent): void {
    try {
      console.log('Received WebSocket message:', event.data);
      const message: WebSocketMessage = JSON.parse(event.data);
      const position = message.payload;
      position.timestamp = new Date(position.timestamp);
      this.userPositions.set(position.userId, position);
      console.log('Updated positions map, now tracking', this.userPositions.size, 'users');
      this.notifyListeners();
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  
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

  public sendMousePosition(x: number, y: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const position: UserPosition = {
        userId: this.userId,
        latitude: y,
        longitude: x,
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

  public getAllPositions(): UserPosition[] {
    return Array.from(this.userPositions.values());
  }

  public getUserId(): string {
    return this.userId;
  }

  
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  
  public addPositionListener(listener: (positions: UserPosition[]) => void): void {
    this.listeners.push(listener);
    
    listener(this.getAllPositions());
  }

  
  public removePositionListener(listener: (positions: UserPosition[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  
  public addStatusListener(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners.push(listener);
    
    listener(this.connectionStatus);
  }

  
  public removeStatusListener(listener: (status: ConnectionStatus) => void): void {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  
  private updateStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  
  private notifyListeners(): void {
    const positions = this.getAllPositions();
    this.listeners.forEach(listener => listener(positions));
  }
}



let serviceInstance: MouseTrackingService | null = null;

export function getMouseTrackingService(): MouseTrackingService {
  if (!serviceInstance) {
    serviceInstance = new MouseTrackingService();
    
    
    window.addEventListener('beforeunload', () => {
      if (serviceInstance) {
        serviceInstance.disconnect();
        serviceInstance = null;
      }
    });
  }
  
  return serviceInstance;
}


const mouseTrackingService = getMouseTrackingService();
export default mouseTrackingService; 