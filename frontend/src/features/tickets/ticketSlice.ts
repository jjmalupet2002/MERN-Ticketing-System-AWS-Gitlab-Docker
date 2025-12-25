import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';

export interface Note {
    _id?: string;
    author: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    role: string;
    content: string;
    createdAt: string;
}

export interface Ticket {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
    title: string;
    description: string;
    product: string;
    status: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    attachments: { filename: string; originalName: string; uploadedAt: string }[];
    notes: Note[];
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

const API_URL = '/api/tickets/';

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

// Get ALL tickets (Agents/Admins)
export const getAllTickets = createAsyncThunk('tickets/getAllStaff', async (_, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + 'all', config);
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

// Claim ticket
export const claimTicket = createAsyncThunk('tickets/claim', async (ticketId: string, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const userId = (thunkAPI.getState() as RootState).auth.user?._id;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + ticketId, { assignedTo: userId, status: 'open' }, config);
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
            .addCase(getAllTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tickets = action.payload;
            })
            .addCase(getAllTickets.rejected, (state, action) => {
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
                state.tickets = state.tickets.map((ticket) =>
                    ticket._id === action.payload._id ? action.payload : ticket
                );
                if (state.ticket?._id === action.payload._id) {
                    state.ticket = action.payload;
                }
            })
            .addCase(claimTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = state.tickets.map((ticket) =>
                    ticket._id === action.payload._id ? action.payload : ticket
                );
            });
    },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;

// Add note to ticket
export const addNote = createAsyncThunk('tickets/addNote', async ({ ticketId, content }: { ticketId: string; content: string }, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL}${ticketId}/notes`, { content }, config);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get notes for a ticket
export const getNotes = createAsyncThunk('tickets/getNotes', async (ticketId: string, thunkAPI) => {
    try {
        const token = (thunkAPI.getState() as RootState).auth.user?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}${ticketId}/notes`, config);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

