import favoritesReducer, { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { Track } from '../types';

describe('favoritesSlice', () => {
  const initialState = { items: [] };
  
  const mockTrack: Track = {
    trackId: 123,
    trackName: 'Test Song',
    artistName: 'Test Artist',
    collectionName: 'Test Album',
    artworkUrl100: 'http://example.com/image.jpg',
    previewUrl: 'http://example.com/audio.mp3',
  };

  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle adding a new favorite', () => {
    const actual = favoritesReducer(initialState, addFavorite(mockTrack));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].trackId).toEqual(123);
  });

  it('should prevent adding duplicate favorites', () => {
    const stateWithTrack = { items: [mockTrack] };
    const actual = favoritesReducer(stateWithTrack, addFavorite(mockTrack));
    expect(actual.items.length).toEqual(1); // Length should still be 1!
  });

  it('should handle removing a favorite', () => {
    const stateWithTrack = { items: [mockTrack] };
    const actual = favoritesReducer(stateWithTrack, removeFavorite(123));
    expect(actual.items.length).toEqual(0);
  });
});