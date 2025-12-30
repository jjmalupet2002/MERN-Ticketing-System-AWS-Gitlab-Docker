import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketManager {
    private static instance: SocketManager;
    private io: SocketIOServer;

    private constructor(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || '*', // Allow all for now, lock down later
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected:', socket.id);

            // Join a ticket room
            socket.on('join_ticket', (ticketId: string) => {
                socket.join(`ticket:${ticketId}`);
                console.log(`Socket ${socket.id} joined ticket:${ticketId}`);
            });

            // Join a user room (for notifications)
            socket.on('join_user', (userId: string) => {
                socket.join(`user:${userId}`);
                console.log(`Socket ${socket.id} joined user:${userId}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    public static init(httpServer: HttpServer): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager(httpServer);
        }
        return SocketManager.instance;
    }

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            throw new Error('SocketManager not initialized!');
        }
        return SocketManager.instance;
    }

    public getIO(): SocketIOServer {
        return this.io;
    }

    // Convenience methods for emitting events
    public emitToTicket(ticketId: string, event: string, data: any): void {
        this.io.to(`ticket:${ticketId}`).emit(event, data);
    }

    public emitToUser(userId: string, event: string, data: any): void {
        this.io.to(`user:${userId}`).emit(event, data);
    }
}
