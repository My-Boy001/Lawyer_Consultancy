import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      query: { userId }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  sendMessage(roomId, message, sender) {
    if (this.socket) {
      this.socket.emit('send-message', {
        roomId,
        message,
        sender
      });
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  sendTypingStatus(roomId, userId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        roomId,
        userId,
        isTyping
      });
    }
  }

  onTypingStatus(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a single instance
const socketService = new SocketService();
export default socketService; 