import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";

function WebStatusBar() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(tick);
  }, []);

  if (Platform.OS !== "web") return null;

  return (
    <View style={styles.webStatusBar}>
      <Text style={styles.webStatusText}>{time}</Text>
      <Text style={styles.webStatusText}>WiFi  88%</Text>
    </View>
  );
}

function PhonePreviewFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isEmbeddedWebPage =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.self !== window.top;

  if (Platform.OS !== "web" || width <= 600 || isEmbeddedWebPage) {
    return <>{children}</>;
  }

  const scale = Math.min(
    1,
    height > 0 ? (height * 0.84) / 860 : 1,
    (width - 48) / 406,
  );
  const phoneWidth = 406 * scale;
  const phoneHeight = 860 * scale;
  const route =
    typeof window === "undefined"
      ? "/"
      : `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const mobileApp = React.createElement("iframe", {
    title: "Bhoomi mobile app preview",
    src: route,
    scrolling: "no",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 390,
      height: 844,
      flexShrink: 0,
      display: "block",
      border: "none",
      backgroundColor: "#fff",
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    },
  });

  return (
    <View style={styles.previewStage}>
      <View
        style={[
          styles.previewPhone,
          {
            width: phoneWidth,
            height: phoneHeight,
            borderRadius: 48 * scale,
            borderWidth: 2 * scale,
            padding: 6 * scale,
          },
        ]}
      >
        <View
          style={[
            styles.previewPhoneScreen,
            { borderRadius: 38 * scale },
          ]}
        >
          {mobileApp}
          <View
            pointerEvents="none"
            style={[
              styles.previewNotchOverlay,
              { top: 6 * scale },
            ]}
          >
            <View
              style={[
                styles.previewNotch,
                {
                  width: 88 * scale,
                  height: 22 * scale,
                  borderRadius: 12 * scale,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#1B5E20" }}>
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            {String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ai-chat" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...Feather.font,
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <RootErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" translucent />
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <PhonePreviewFrame>
                  <WebStatusBar />
                  <RootLayoutNav />
                </PhonePreviewFrame>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </RootErrorBoundary>
  );
}

const styles = StyleSheet.create({
  webStatusBar: {
    backgroundColor: "#1B5E20",
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  webStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  previewStage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeeb",
    overflow: "hidden",
  },
  previewPhone: {
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#333",
    padding: 6,
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
  previewPhoneScreen: {
    flex: 1,
    borderRadius: 38,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
  },
  previewNotchOverlay: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  previewNotch: {
    width: 88,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#080808",
  },
});
