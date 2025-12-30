import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

const API_URL = '/api/notifications/';

export interface Notification {
    _id: string;
    recipient: string;
    ticket: {
        _id: string;
        title: string;
        status: string;
    };
    type: 'ASSIGNED' | 'UPDATED' | 'CLOSED' | 'REPLY';
    message: string;
    seen: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get notifications
export const getNotifications = createAsyncThunk('notifications/getAll', async (_, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get unread count
export const getUnreadCount = createAsyncThunk('notifications/getUnreadCount', async (_, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + 'unread-count', config);
        return response.data.count;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Mark as read
export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id: string, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.patch(API_URL + id + '/read', {}, config);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Mark all as read
export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.patch(API_URL + 'read-all', {}, config);
        return null;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        reset: () => initialState,
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex((n) => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index].seen = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({ ...n, seen: true }));
                state.unreadCount = 0;
            });
    },
});

export const { reset, clearNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
