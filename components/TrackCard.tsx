import { Track } from '@/types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { addTrack } from '../store/historySlice';
import { downloadAudioToCache, removeAudioFromCache } from '../utils/fileCache';

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  // const [liked, setLiked] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLiked = useAppSelector((state) => 
    state.favorites.items.some((item) => item.trackId === track.trackId)
  );

  const handlePress = () => {
    dispatch(addTrack(track));
    router.push({
      pathname: '/track/[id]',
      params: {
        id: track.trackId,
        trackName: track.trackName,
        artistName: track.artistName,
        artworkUrl: track.artworkUrl100.replace('100x100', '300x300'),
        previewUrl: track.previewUrl,
      },
    });
  };

  const toggleFavorite = async () => {
  if (isLiked) {
    dispatch(removeFavorite(track.trackId));
    await removeAudioFromCache(track.trackId); // Delete from hard drive
  } else {
    dispatch(addFavorite(track));
    // Download to hard drive (fire and forget, it happens in the background!)
    await downloadAudioToCache(track.trackId, track.previewUrl); 
  }
};

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={handlePress}>
      <Image source={{ uri: track.artworkUrl100 }} style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>{track.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artistName}</Text>
      </View>
      <View style={styles.actions}>
        <Ionicons name="play-circle-outline" size={26} color="#555" style={styles.playIcon} />
        <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <FontAwesome
            name={isLiked ? 'heart' : 'heart-o'}
            size={20}
            color={isLiked ? '#e74c3c' : '#bbb'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  artwork: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  trackName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  artistName: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playIcon: {
    marginRight: 2,
  },
});