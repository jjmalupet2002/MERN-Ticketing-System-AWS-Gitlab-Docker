import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ticket: ticketReducer,
        notification: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
