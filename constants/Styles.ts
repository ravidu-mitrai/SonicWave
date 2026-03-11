import { StyleSheet } from "react-native";
 
export const Colors = {
  dark: {
    background: "#0F0F0F",        
    surface: "#1A1A1A",           
    surfaceHigh: "#242424",       
    border: "rgba(255,255,255,0.07)",
    accent: "#E8956D",            
    accentSoft: "rgba(232,149,109,0.15)",
    accentMuted: "rgba(232,149,109,0.5)",
    textPrimary: "#F2EDE8",       
    textSecondary: "#9A9087",     
    textTertiary: "#5A5550",      
    shimmer: "#2A2A2A",
    shadow: "rgba(255,255,255,0.15)", 
  },
  light: {
    background: "#FCFAF8",        
    surface: "#F2EDE8",           
    surfaceHigh: "#EAE4DE",       
    border: "rgba(0,0,0,0.06)",
    accent: "#D97B54",            
    accentSoft: "rgba(217,123,84,0.15)",
    accentMuted: "rgba(217,123,84,0.5)",
    textPrimary: "#1A1A1A",       
    textSecondary: "#5A5550",     
    textTertiary: "#9A9087",      
    shimmer: "#E0E0E0",
    shadow: "#000",
  }
};

// Shared Shadows 
const getCardShadow = (colors: typeof Colors.light) => ({
  shadowColor: colors.shadow,
  shadowOpacity: 0.25,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
});

export const getCommonStyles = (colors: typeof Colors.light) => StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  smallCard: {
    width: 120,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...getCardShadow(colors),
  },
  smallArtwork: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 9,
  },
  smallTrackName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  smallArtistName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    letterSpacing: 0.1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 15,
    color: colors.textSecondary,
    letterSpacing: 0.2,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});