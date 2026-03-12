import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Colors, getCommonStyles } from "../constants/Styles";

// IMPORT THE AUTH LIBRARIES
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const theme = useColorScheme() ?? "dark";
  const colors = Colors[theme];
  const commonStyles = getCommonStyles(colors);
  const styles = getStyles(colors, commonStyles);
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // INITIALIZE GOOGLE SIGN-IN
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '43073931888-4av2vgh5eob9p5p6290amsut5pu5ngoh.apps.googleusercontent.com', 
    });
  }, []);

  // LOGIN FUNCTION
  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    
    try {
      setIsSigningIn(true);
      // Check if the user's Android device has Google Play Services installed
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Trigger the Google Sign-In modal and get the ID token
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a Firebase credential using that token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(getAuth(), googleCredential);
      
      router.replace("/(app)/discover");

    } catch (error: any) {
      console.error("Login Failed:", error);
      Alert.alert("Login Error", error.message || "Something went wrong.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} />
      
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="musical-notes" size={48} color={colors.accent} />
          </View>
          <Text style={styles.appName}>SonicWave</Text>
          <Text style={styles.tagline}>Premium audio, tailored for you.</Text>
        </View>

        <View style={styles.authContainer}>
          <TouchableOpacity
            style={[styles.googleButton, isSigningIn && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            <Ionicons name="logo-google" size={20} color={colors.background} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>
              {isSigningIn ? "Signing In..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors: typeof Colors.light, commonStyles: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    glowTop: {
      position: "absolute",
      top: -100,
      left: -100,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: colors.accent,
      opacity: 0.08,
    },
    glowBottom: {
      position: "absolute",
      bottom: -150,
      right: -100,
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: colors.accent,
      opacity: 0.05,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 32,
      paddingTop: 120,
      paddingBottom: 60,
    },
    brandContainer: {
      alignItems: "center",
    },
    iconContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.accent,
      shadowOpacity: 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      marginBottom: 24,
    },
    appName: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 15,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    authContainer: {
      width: "100%",
    },
    googleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 30,
      shadowColor: colors.accent,
      shadowOpacity: 0.4,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
      marginBottom: 20,
    },
    googleIcon: {
      marginRight: 10,
    },
    googleButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.background, 
      letterSpacing: 0.5,
    },
    termsText: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center",
      lineHeight: 18,
      paddingHorizontal: 20,
    },
  });