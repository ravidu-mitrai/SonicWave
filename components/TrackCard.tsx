import { Track } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: track.artworkUrl100 }} style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>{track.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artistName}</Text>
      </View>
      <TouchableOpacity onPress={() => setLiked(!liked)}>
        <FontAwesome
          name={liked ? 'heart' : 'heart-o'}
          size={22}
          color={liked ? '#e74c3c' : '#bbb'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
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
    color: '#888',
    marginTop: 3,
  },
});