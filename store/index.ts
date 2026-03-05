import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesReducer, { addFavorite, removeFavorite } from './favoritesSlice';
import historyReducer, { addQuery, addTrack } from './historySlice';

// Create a listener middleware to watch for specific actions
const listenerMiddleware = createListenerMiddleware();

// Tell it to listen for either 'addFavorite' or 'removeFavorite'
listenerMiddleware.startListening({
  matcher: isAnyOf(addFavorite, removeFavorite),
  effect: async (action, listenerApi) => {
    // Whenever those actions happen, grab the latest state and save it locally
    const state = listenerApi.getState() as RootState;
    try {
      await AsyncStorage.setItem('sonicwave_favorites', JSON.stringify(state.favorites.items));
    } catch (error) {
      console.error('Failed to save favorites to local storage', error);
    }
  },
});

// Listen for History changes
listenerMiddleware.startListening({
  matcher: isAnyOf(addQuery, addTrack),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    try {
      await AsyncStorage.setItem('sonicwave_history', JSON.stringify(state.history));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  },
});

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    history: historyReducer,
  },
  // Add the middleware to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;