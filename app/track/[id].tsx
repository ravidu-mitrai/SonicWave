import CustomHeader from "@/components/CustomHeader";
import { Track } from "@/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { addFavorite, removeFavorite } from "../../store/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    downloadAudioToCache,
    getLocalAudioUri,
    removeAudioFromCache,
} from "../../utils/fileCache";
import { formatTime } from "../../utils/timeFormat";
import { Colors } from "../../constants/Styles";

export default function TrackDetailScreen() {
  const router = useRouter();
  const { id, trackName, artistName, artworkUrl, previewUrl } = useLocalSearchParams();
  const netInfo = useNetInfo();

  const trackIdNum = Number(id);
  const dispatch = useAppDispatch();
  const [hasCached, setHasCached] = useState(false);

  // ─── Dynamic Theme Setup ───
  const theme = useColorScheme() ?? 'dark';
  const colors = Colors[theme];
  const styles = getStyles(colors);

  const isLiked = useAppSelector((state) =>
    state.favorites.items.some((item) => item.trackId === trackIdNum),
  );

  const skipForward = () => {
    const newTime = position + 15;
    player.seekTo(newTime > duration ? duration : newTime);
  };

  const skipBackward = () => {
    const newTime = position - 15;
    player.seekTo(newTime < 0 ? 0 : newTime);
  };

  const toggleFavorite = async () => {
    if (isLiked) {
      dispatch(removeFavorite(trackIdNum));
      await removeAudioFromCache(trackIdNum); 
    } else {
      const trackObj: Track = {
        trackId: trackIdNum,
        trackName: trackName as string,
        artistName: artistName as string,
        collectionName: "Unknown Album",
        artworkUrl100: (artworkUrl as string).replace("300x300", "100x100"),
        previewUrl: previewUrl as string,
      };
      dispatch(addFavorite(trackObj));
      await downloadAudioToCache(trackIdNum, previewUrl as string);
    }
  };

  const player = useAudioPlayer(previewUrl as string); 
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    const checkLocalCache = async () => {
      const fileUri = getLocalAudioUri(trackIdNum);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setHasCached(true);
        player.replace(fileUri);
        console.log("Now playing from local offline storage");
      } else {
        setHasCached(false);
      }
    };
    checkLocalCache();
  }, [trackIdNum]);

  const duration = status.duration ?? 0;
  const position = status.currentTime ?? 0;
  const progress = duration > 0 ? position / duration : 0;

  return (
    <>
      <CustomHeader title="Now Playing" showBack />
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        {/* Update status bar to match theme dynamically */}
        <StatusBar barStyle={theme === 'light' ? "dark-content" : "light-content"} />

        <View style={styles.artworkContainer}>
          <Image source={{ uri: artworkUrl as string }} style={styles.artwork} />
          <View style={styles.artworkGlow} />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoText}>
            <Text style={styles.trackTitle} numberOfLines={1}>{trackName}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
          </View>
          <TouchableOpacity
            onPress={toggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.heartButton, isLiked && styles.heartButtonActive]}
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={20}
              color={isLiked ? colors.accent : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.skipButton} onPress={skipBackward} activeOpacity={0.7}>
            <Ionicons name="play-back-outline" size={28} color={colors.textSecondary} />
            <Text style={styles.skipLabel}>15s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (netInfo.isConnected === false && !hasCached) {
                Alert.alert(
                  "You're Offline",
                  "Only favorited tracks that were downloaded will play offline.",
                );
                return;
              }
              if (status.playing) {
                player.pause();
              } else {
                player.play();
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name={status.playing ? "pause" : "play"}
              size={32}
              color={colors.background}
              style={{ marginLeft: status.playing ? 0 : 3 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={skipForward} activeOpacity={0.7}>
            <Ionicons name="play-forward-outline" size={28} color={colors.textSecondary} />
            <Text style={styles.skipLabel}>15s</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
  },
  artworkContainer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 50,
  },
  artwork: {
    width: 330,
    height: 330,
    borderRadius: 22,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 16 },
  },
  artworkGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.accent,
    opacity: 0.06,
    bottom: -20,
    alignSelf: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  infoText: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0.1,
    marginBottom: 6,
  },
  artistName: {
    fontSize: 15,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  heartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  heartButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentMuted,
  },
  progressSection: {
    marginBottom: 30,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: colors.surfaceHigh,
    borderRadius: 2,
    position: "relative",
    justifyContent: "center",
  },
  progressBarFill: {
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.accent,
    top: -5,
    marginLeft: -6,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeText: {
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  skipButton: {
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  skipLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});