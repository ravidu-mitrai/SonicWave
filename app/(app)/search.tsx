import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import TrackCard from '../../components/TrackCard';
import { mockTracks } from '../../constants/mockData';
import { Track } from '../../types';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Track[]>(mockTracks);

  // The Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Waits 500ms after the user stops typing

    // Cleanup function: clears the timer if the user types again before 500ms is up
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // The Multi-Category Search Logic
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      // If the search is empty, show all mock tracks
      setFilteredData(mockTracks);
    } else {
      // Filter the data based on track, artist, or collection name
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      const results = mockTracks.filter((track) => 
        track.trackName.toLowerCase().includes(lowerCaseQuery) ||
        track.artistName.toLowerCase().includes(lowerCaseQuery) ||
        track.collectionName.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(results);
    }
  }, [debouncedQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
         
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={({ item }) => <TrackCard track={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              No results found for "{debouncedQuery}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});