import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

// Dynamic URL: Uses VITE_API_URL in Prod (Render), or defaults to localhost in Dev
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Initialize Socket connection
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'], // Force WebSocket for better performance
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
            setIsConnected(true);

            // Join User Room for Notifications
            if (user) {
                newSocket.emit('join_user', user._id);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Re-join user room if user logs in after socket init
    useEffect(() => {
        if (socket && user) {
            socket.emit('join_user', user._id);
        }
    }, [user, socket]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
