import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesReducer, { addFavorite, removeFavorite } from './favoritesSlice';

// 1. Create a listener middleware to watch for specific actions
const listenerMiddleware = createListenerMiddleware();

// 2. Tell it to listen for either 'addFavorite' or 'removeFavorite'
listenerMiddleware.startListening({
  matcher: isAnyOf(addFavorite, removeFavorite),
  effect: async (action, listenerApi) => {
    // 3. Whenever those actions happen, grab the latest state and save it locally
    const state = listenerApi.getState() as RootState;
    try {
      await AsyncStorage.setItem('sonicwave_favorites', JSON.stringify(state.favorites.items));
    } catch (error) {
      console.error('Failed to save favorites to local storage', error);
    }
  },
});

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  // Add the middleware to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;