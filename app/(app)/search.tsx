import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import TrackCard from '../../components/TrackCard';
import { Track } from '../../types';
import { fetchTracks } from '../../api/itunesApi'; 
import CustomHeader from '@/components/CustomHeader';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addQuery } from '../../store/historySlice';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector((state) => state.history.queries);
  
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
      dispatch(addQuery(debouncedQuery)); 
      
      const results = await fetchTracks(debouncedQuery); 
      setFilteredData(results);
      setIsLoading(false);
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
      
      {/* The UI to actually show the recent searches! */}
      {searchQuery.trim() === '' && recentSearches.length > 0 ? (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          <View style={styles.chipsContainer}>
            {recentSearches.map((term, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.chip}
                onPress={() => setSearchQuery(term)} 
              >
                <Ionicons name="time-outline" size={16} color="#666" style={styles.chipIcon} />
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : isLoading ? (
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
            ) : null 
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
    marginLeft: 10,
    marginRight: 10,
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
  recentContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 24 
  },
  recentTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1a1a1a', 
    marginBottom: 12 
  },
  chipsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10
  },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  chipIcon: { marginRight: 6 },
  chipText: { fontSize: 14, color: '#333' },
});