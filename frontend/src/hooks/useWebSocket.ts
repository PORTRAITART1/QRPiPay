import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWebSocket(userId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
      {
        auth: {
          userId
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      }
    );

    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      socket.emit('user:join', { userId });
    });

    socket.on('payment:updated', (data) => {
      console.log('💳 Payment update:', data);
    });

    socket.on('payment:completed', (data) => {
      console.log('✅ Payment completed:', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket déconnecté');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}
