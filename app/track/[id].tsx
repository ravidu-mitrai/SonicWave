import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import { formatTime } from '../../utils/timeFormat';
import { downloadAudioToCache, removeAudioFromCache } from '../../utils/fileCache';
import { Track } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import { getLocalAudioUri } from '../../utils/fileCache';

export default function TrackDetailScreen() {
  const router = useRouter();
  const { id, trackName, artistName, artworkUrl, previewUrl } = useLocalSearchParams();

  // const [liked, setLiked] = useState(false);
  const trackIdNum = Number(id); 
  const dispatch = useAppDispatch();

  const isLiked = useAppSelector((state) => 
    state.favorites.items.some((item) => item.trackId === trackIdNum)
  );

  // Jump forward 15 seconds
  const skipForward = () => {
    const newTime = position + 15;
    // If skipping 15s pushes us past the song duration, just go to the very end
    player.seekTo(newTime > duration ? duration : newTime);
  };

  // Jump backward 15 seconds
  const skipBackward = () => {
    const newTime = position - 15;
    // If skipping back pushes us into negative time, just go back to 0 (the start)
    player.seekTo(newTime < 0 ? 0 : newTime);
  };

  // const toggleFavorite = () => {
  //   if (isLiked) {
  //     dispatch(removeFavorite(trackIdNum));
  //   } else {
  //     // Reconstruct the track object from the URL params to save to Redux
  //     dispatch(addFavorite({
  //       trackId: trackIdNum,
  //       trackName: trackName as string,
  //       artistName: artistName as string,
  //       collectionName: 'Unknown Album', // Default fallback
  //       artworkUrl100: (artworkUrl as string).replace('300x300', '100x100'), // Revert to standard size for the store
  //       previewUrl: previewUrl as string,
  //     }));
  //   }
  // };

  const toggleFavorite = async () => {
    if (isLiked) {
      dispatch(removeFavorite(trackIdNum));
      await removeAudioFromCache(trackIdNum); // Use the number variable we created
    } else {
      // 1. Reconstruct the track object from the URL params to save to Redux
      const trackObj: Track = {
        trackId: trackIdNum,
        trackName: trackName as string,
        artistName: artistName as string,
        collectionName: 'Unknown Album', 
        artworkUrl100: (artworkUrl as string).replace('300x300', '100x100'),
        previewUrl: previewUrl as string,
      };
      
      dispatch(addFavorite(trackObj));
      
      // 2. Download using the individual string
      await downloadAudioToCache(trackIdNum, previewUrl as string); 
    }
  };

  const player = useAudioPlayer(previewUrl as string); // Defaults to the web URL
  const status = useAudioPlayerStatus(player);

  // NEW: The Smart Caching Logic
  useEffect(() => {
    const checkLocalCache = async () => {
      const fileUri = getLocalAudioUri(trackIdNum);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // If the file exists on the hard drive, hot-swap the audio source!
      if (fileInfo.exists) {
        player.replace(fileUri);
        console.log('Now playing from local offline storage');
      }
    };

  checkLocalCache();
}, [trackIdNum]);

  // const player = useAudioPlayer(previewUrl as string);
  // const status = useAudioPlayerStatus(player);

  // progress 0–1
  const duration = status.duration ?? 0;
  const position = status.currentTime ?? 0;
  const progress = duration > 0 ? position / duration : 0;

  // format seconds -> m:ss
  // const formatTime = (secs: number) => {
  //   const m = Math.floor(secs / 60);
  //   const s = Math.floor(secs % 60);
  //   return `${m}:${s.toString().padStart(2, '0')}`;
  // };

  return (
    <>
    <CustomHeader title="Music" showBack />
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />  
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Now Playing</Text>
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: artworkUrl as string }} style={styles.artwork} />
      </View>

      {/* Track info + like */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.trackTitle} numberOfLines={1}>{trackName}</Text>
          <Text style={styles.artistName}>{artistName}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name={isLiked ? 'heart' : 'heart-o'}
            size={24}
            color={isLiked ? '#e74c3c' : '#ccc'}
          />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          {/* Thumb */}
          <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>

        <TouchableOpacity style={styles.skipButton} onPress={skipBackward} activeOpacity={0.7}>
          <Ionicons name="play-back" size={32} color="#1a1a1a" /> 
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            if (status.playing) {
              player.pause();
            } else {
              player.play();
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={status.playing ? 'pause' : 'play'}
            size={36}
            color="#fff"
            style={{ marginLeft: status.playing ? 0 : 3 }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={skipForward} activeOpacity={0.7}>
          <Ionicons name="play-forward" size={32} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 16,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },

  // Artwork
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  infoText: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: '#999',
  },

  // Progress
  progressSection: {
    marginBottom: 32,
    marginTop: 60,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    top: -4,
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#aaa',
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: 8,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1a1a',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});