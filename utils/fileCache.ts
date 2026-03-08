import * as FileSystem from 'expo-file-system/legacy';

// Create a consistent naming system
export const getLocalAudioUri = (trackId: number) => {
  // Give TypeScript a fallback in case it runs in a web browser where this is null
  const dir = FileSystem.documentDirectory || ''; 
  return `${dir}track_${trackId}.m4a`;
};

// Download the file from the internet to the local hard drive
export const downloadAudioToCache = async (trackId: number, webUrl: string) => {
  try {
    const fileUri = getLocalAudioUri(trackId);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    // Only download it if we don't already have it saved!
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(webUrl, fileUri);
      console.log(`Successfully cached track: ${trackId}`);
    }
  } catch (error) {
    console.error("Error downloading audio file:", error);
  }
};

// 3. Delete the file to free up space when a user removes a favorite
export const removeAudioFromCache = async (trackId: number) => {
  try {
    const fileUri = getLocalAudioUri(trackId);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      console.log(`Deleted cached track: ${trackId}`);
    }
  } catch (error) {
    console.error("Error deleting audio file:", error);
  }
};
