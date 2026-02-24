import { Track } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface TrackCardProps {
    track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
    return(
        <TouchableOpacity style={styles.cardContainer}>
            <Image source={{ uri: track.artworkUrl100 }} style={styles.artwork} />
            <View style={styles.textContainer}>
                <Text style={styles.trackName} numberOfLines={1}>{track.trackName}</Text>
                <Text style={styles.artistName} numberOfLines={1}>{track.artistName}</Text>
            </View>
            <FontAwesome name='heart'size={28} color={'lightblue'} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});