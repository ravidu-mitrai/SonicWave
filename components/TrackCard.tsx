import { Track } from '@/types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { addTrack } from '../store/historySlice';
import { downloadAudioToCache, removeAudioFromCache } from '../utils/fileCache';
import { Colors } from '../constants/Styles';

interface TrackCardProps {
  track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ─── Dynamic Theme Setup ───
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const styles = getStyles(colors);

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
      await removeAudioFromCache(track.trackId); 
    } else {
      dispatch(addFavorite(track));
      await downloadAudioToCache(track.trackId, track.previewUrl); 
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
      <Image source={{ uri: track.artworkUrl100 }} style={styles.artwork} />
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>{track.trackName}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artistName}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.playIconWrap}>
          <Ionicons name="play" size={14} color={colors.accent} />
        </View>
        <TouchableOpacity
          onPress={toggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.heartButton}
        >
          <FontAwesome
            name={isLiked ? 'heart' : 'heart-o'}
            size={18}
            color={isLiked ? colors.accent : colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  trackName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginLeft: 10,
  },
  playIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButton: {
    padding: 2,
  },
});