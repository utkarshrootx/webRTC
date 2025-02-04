import React, { useState, useRef, useEffect } from "react";
import { View, Button, StyleSheet, Platform, Text } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

// Conditionally import WebRTC only for mobile
let mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCView;
if (Platform.OS !== "web") {
  const WebRTC = require("react-native-webrtc");
  mediaDevices = WebRTC.mediaDevices;
  RTCPeerConnection = WebRTC.RTCPeerConnection;
  RTCSessionDescription = WebRTC.RTCSessionDescription;
  RTCView = WebRTC.RTCView;
}

SplashScreen.preventAutoHideAsync();

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const WebRTCClient = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(
    Platform.OS !== "web" ? new RTCPeerConnection(configuration) : null
  ).current;
  const colorScheme = useColorScheme() ?? "light";

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const startLocalStream = async () => {
    try {
      let stream;
      if (Platform.OS === "web") {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } else {
        stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      }
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const createOffer = async () => {
    if (Platform.OS === "web") {
      console.log("WebRTC not yet implemented for web");
    } else {
      const offer = await peerConnection.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await peerConnection.setLocalDescription(
        new RTCSessionDescription(offer)
      );
      console.log("Offer Created:", offer);
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {localStream && Platform.OS === "web" && (
          <video
            autoPlay
            playsInline
            ref={(video) => video && (video.srcObject = localStream)}
            style={styles.video}
          />
        )}
        {localStream && Platform.OS !== "web" && (
          <RTCView streamURL={localStream.toURL()} style={styles.video} />
        )}
        <Button title="Start Call" onPress={createOffer} />
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: 200,
    height: 200,
    backgroundColor: "black",
    margin: 10,
  },
});

export default WebRTCClient;
