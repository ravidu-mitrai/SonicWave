import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '../types';

interface FavoritesState {
  items: Track[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Action to add a track
    addFavorite: (state, action: PayloadAction<Track>) => {
      const exists = state.items.some(track => track.trackId === action.payload.trackId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    // Action to remove a track by ID
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(track => track.trackId !== action.payload);
    },
    // Action to hydrate the store from local storage on startup
    setFavorites: (state, action: PayloadAction<Track[]>) => {
      state.items = action.payload; 
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;