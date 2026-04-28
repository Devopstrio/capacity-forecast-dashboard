import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const fetchCapacity = createAsyncThunk(
  'capacity/fetchCapacity',
  async ({ service, region }: { service?: string; region?: string }, { getState }) => {
    const state: any = getState();
    const response = await axios.get(`${API_URL}/capacity/`, {
      params: { service_name: service, region },
      headers: { Authorization: `Bearer ${state.auth.token}` }
    });
    return response.data;
  }
);

export const fetchForecast = createAsyncThunk(
  'capacity/fetchForecast',
  async ({ service, region }: { service: string; region: string }, { getState }) => {
    const state: any = getState();
    const response = await axios.get(`${API_URL}/capacity/forecast`, {
      params: { service_name: service, region },
      headers: { Authorization: `Bearer ${state.auth.token}` }
    });
    return response.data;
  }
);

interface CapacityState {
  records: any[];
  forecast: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CapacityState = {
  records: [],
  forecast: [],
  loading: false,
  error: null,
};

const capacitySlice = createSlice({
  name: 'capacity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCapacity.pending, (state) => { state.loading = True; })
      .addCase(fetchCapacity.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast = action.payload;
      });
  },
});

export default capacitySlice.reducer;
