import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

export interface Ticket {
    _id: string;
    title: string;
    description: string;
    product: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface TicketState {
    tickets: Ticket[];
    ticket: Ticket | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: TicketState = {
    tickets: [],
    ticket: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const API_URL = 'http://localhost:5000/api/tickets/';

// Create new ticket
export const createTicket = createAsyncThunk('tickets/create', async (ticketData: any, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, ticketData, config);
        return response.data;
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get user tickets
export const getTickets = createAsyncThunk('tickets/getAll', async (_, thunkAPI) => {
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
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get user ticket
export const getTicket = createAsyncThunk('tickets/get', async (ticketId: string, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + ticketId, config);
        return response.data;
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Close ticket
export const closeTicket = createAsyncThunk('tickets/close', async (ticketId: string, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + ticketId, { status: 'closed' }, config);
        return response.data;
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTicket.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tickets = action.payload;
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.ticket = action.payload;
            })
            .addCase(getTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(closeTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets.map((ticket) =>
                    ticket._id === action.payload._id ? (ticket.status = 'closed') : ticket
                );
            });
    },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
