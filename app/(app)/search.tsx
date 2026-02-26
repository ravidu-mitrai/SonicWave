import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import TrackCard from '../../components/TrackCard';
import { Track } from '../../types';
import { fetchTracks } from '../../api/itunesApi'; 
import CustomHeader from '@/components/CustomHeader';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // The Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // The LIVE Multi-Category Search Logic
  useEffect(() => {
    const getSearchResults = async () => {
      if (debouncedQuery.trim() === '') {
        // If the search is empty, clear the list instead of fetching
        setFilteredData([]);
        return;
      }

      setIsLoading(true); // Start the spinner
      const results = await fetchTracks(debouncedQuery); // Fetch real data!
      setFilteredData(results);
      setIsLoading(false); // Stop the spinner
    };

    getSearchResults();
  }, [debouncedQuery]);

  return (
    <>
    <CustomHeader title="Search" />
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
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a1a1a" />
          <Text style={styles.loadingText}>Searching iTunes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={({ item }) => <TrackCard track={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            debouncedQuery !== '' ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="musical-notes-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  No results found for "{debouncedQuery}"
                </Text>
              </View>
            ) : null // Show nothing if the user hasn't typed anything
          }
        />
      )}
    </View>
    </>
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
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 14, 
    color: '#666' 
  },
});