import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchTickets = createAsyncThunk(
  'tickets/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tickets', {
        ...getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/tickets/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/tickets', ticketData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ id, ...ticketData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tickets/${id}`, ticketData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tickets/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete ticket');
    }
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assign',
  async ({ id, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/tickets/${id}/assign`, { assignedTo }, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
    }
  }
);

export const addComment = createAsyncThunk(
  'tickets/addComment',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/tickets/${id}/comments`, { text }, getAuthHeader());
      return { id, comment: response.data.comment };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const fetchTicketStats = createAsyncThunk(
  'tickets/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tickets/stats', getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    items: [],
    currentTicket: null,
    stats: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload.ticket;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.items.unshift(action.payload.ticket);
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload.ticket._id);
        if (index !== -1) {
          state.items[index] = action.payload.ticket;
        }
        if (state.currentTicket?._id === action.payload.ticket._id) {
          state.currentTicket = action.payload.ticket;
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentTicket?._id === action.payload.id) {
          state.currentTicket.comments.push(action.payload.comment);
        }
      })
      .addCase(fetchTicketStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { clearCurrentTicket, clearError } = ticketSlice.actions;
export default ticketSlice.reducer;
