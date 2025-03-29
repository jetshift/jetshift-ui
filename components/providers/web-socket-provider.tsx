"use client";

import React, {createContext, useContext, useEffect, useRef, useCallback} from 'react';
import {useToast} from "@/hooks/use-toast";

type WebSocketContextType = {
    sendMessage: (message: string | object) => void;
    subscribe: (callback: (data: any) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Global subscribers array
const subscribers: Array<(data: any) => void> = [];

export const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectInterval = 3000;
    const {toast} = useToast();

    const connectWebSocket = useCallback(() => {
        if (!wsUrl || socketRef.current) return;

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('✅ WebSocket connected');
            reconnectAttempts.current = 0;
            socket.send(JSON.stringify({message: 'Hello from Next.js'}));
        };

        socket.onmessage = (event) => {
            console.log('📩 Received:', event.data);
            let data;
            try {
                data = JSON.parse(event.data);
                if (data.message === "testws") {
                    toast({
                        description: "Successfully connected to WebSocket server.",
                    })
                }
            } catch {
                console.warn('Received non-JSON message');
                return;
            }

            // Notify all subscribers
            subscribers.forEach((callback) => callback(data));
        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('⚠️ WebSocket closed');
            socketRef.current = null;
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current += 1;
                setTimeout(connectWebSocket, reconnectInterval);
                console.log(`🔄 Reconnecting... Attempt ${reconnectAttempts.current}`);
            } else {
                console.error('🚫 Max reconnection attempts reached.');
            }
        };
    }, [wsUrl]);

    useEffect(() => {
        connectWebSocket();
        return () => socketRef.current?.close();
    }, [connectWebSocket]);

    const sendMessage = useCallback((message: string | object) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const data = typeof message === 'object' ? JSON.stringify(message) : message;
            socketRef.current.send(data);
            console.log('✅ Message sent:', data);
        } else {
            console.error('❌ WebSocket is not connected.');
        }
    }, []);

    const subscribe = useCallback((callback: (data: any) => void) => {
        subscribers.push(callback);
        // Return unsubscribe function
        return () => {
            const index = subscribers.indexOf(callback);
            if (index !== -1) subscribers.splice(index, 1);
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{sendMessage, subscribe}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};
