// hooks/useWebSocket.ts
import { useRef, useEffect, useCallback } from "react";

export default function useWebSocket() {
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectInterval = 3000;
    const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;

    const connectWebSocket = useCallback(() => {
        if (!wsUrl) {
            console.error('WebSocket URL is not defined.');
            return;
        }

        if (socketRef.current) return; // Already connected

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts.current = 0;
            socket.send(JSON.stringify({ message: 'Hello from Next.js' }));

            heartbeatInterval.current = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 15000);
        };

        socket.onmessage = (event) => {
            console.log('Received:', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed:', event.reason);
            clearInterval(heartbeatInterval.current as NodeJS.Timeout);
            socketRef.current = null;

            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current += 1;
                setTimeout(() => {
                    console.log(`Reconnecting... Attempt ${reconnectAttempts.current}`);
                    connectWebSocket();
                }, reconnectInterval);
            } else {
                console.error('Max reconnection attempts reached.');
            }
        };
    }, [wsUrl]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            console.log('Cleaning up WebSocket');
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, [connectWebSocket]);

    const sendWebSocketMessage = useCallback((message: string | object) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const data = typeof message === 'object' ? JSON.stringify(message) : message;
            socketRef.current.send(data);
            console.log('Message sent:', data);
        } else {
            console.error('WebSocket is not connected.');
        }
    }, []);

    return { sendWebSocketMessage };
}
