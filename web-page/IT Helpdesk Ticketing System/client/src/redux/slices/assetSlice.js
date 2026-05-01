import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const fetchAssets = createAsyncThunk(
  'assets/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/assets', {
        ...getAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assets');
    }
  }
);

export const fetchAssetById = createAsyncThunk(
  'assets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/assets/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch asset');
    }
  }
);

export const createAsset = createAsyncThunk(
  'assets/create',
  async (assetData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/assets', assetData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create asset');
    }
  }
);

export const updateAsset = createAsyncThunk(
  'assets/update',
  async ({ id, ...assetData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/assets/${id}`, assetData, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update asset');
    }
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/assets/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete asset');
    }
  }
);

export const assignAsset = createAsyncThunk(
  'assets/assign',
  async ({ id, assignedTo, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/assets/${id}/assign`, { assignedTo, notes }, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign asset');
    }
  }
);

export const fetchAssetStats = createAsyncThunk(
  'assets/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/assets/stats', getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    items: [],
    currentAsset: null,
    stats: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentAsset: (state) => {
      state.currentAsset = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.assets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.currentAsset = action.payload.asset;
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.items.unshift(action.payload.asset);
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.items.findIndex(a => a._id === action.payload.asset._id);
        if (index !== -1) {
          state.items[index] = action.payload.asset;
        }
        if (state.currentAsset?._id === action.payload.asset._id) {
          state.currentAsset = action.payload.asset;
        }
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a._id !== action.payload);
      })
      .addCase(fetchAssetStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { clearCurrentAsset, clearError } = assetSlice.actions;
export default assetSlice.reducer;
