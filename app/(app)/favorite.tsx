import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import TrackCard from '../../components/TrackCard';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks'; 
import CustomHeader from '../../components/CustomHeader';

export default function FavoritesScreen() {
  const favoriteTracks = useAppSelector((state) => state.favorites.items);

  return (
    <>
      <CustomHeader title="Favorites" />
      <View style={styles.container}>
        <FlatList
          data={favoriteTracks} 
          keyExtractor={(item) => item.trackId.toString()}
          renderItem={({ item }) => <TrackCard track={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-dislike-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No favorite tracks yet.</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});