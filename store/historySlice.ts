import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '../types';

interface HistoryState {
  queries: string[];
  tracks: Track[];
}

const initialState: HistoryState = {
  queries: [],
  tracks: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      // Remove duplicate, add to front, keep top 5
      state.queries = [
        query,
        ...state.queries.filter((q) => q.toLowerCase() !== query.toLowerCase()),
      ].slice(0, 5);
    },
    addTrack: (state, action: PayloadAction<Track>) => {
      // Remove duplicate, add to front, keep top 5
      state.tracks = [
        action.payload,
        ...state.tracks.filter((t) => t.trackId !== action.payload.trackId),
      ].slice(0, 5);
    },
    setHistory: (state, action: PayloadAction<HistoryState>) => {
      state.queries = action.payload.queries || [];
      state.tracks = action.payload.tracks || [];
    },
  },
});

export const { addQuery, addTrack, setHistory } = historySlice.actions;
export default historySlice.reducer;