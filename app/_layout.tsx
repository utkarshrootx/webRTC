// Install dependencies
// npm install react-native-webrtc
// npm install @react-native-community/netinfo

import React, { useState, useRef, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
} from "react-native-webrtc";
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const WebRTCClient = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef(new RTCPeerConnection(configuration)).current;
  const colorScheme = useColorScheme();
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
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const newStream = new MediaStream();
      stream.getTracks().forEach((track) => newStream.addTrack(track));
      setLocalStream(newStream);
      newStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, newStream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const createOffer = async () => {
    const offer = await peerConnection.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    });
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    console.log("Offer Created:", offer);
  };

  // const handleRemoteOffer = async (offer: RTCSessionDescriptionInit) => {
  //   await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  //   const answer = await peerConnection.createAnswer();
  //   await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  //   console.log("Answer Created:", answer);
  // };

  useEffect(() => {
    peerConnection.addEventListener("track", (event) => {
      const newRemoteStream = new MediaStream();
      event.streams[0]
        .getTracks()
        .forEach((track) => newRemoteStream.addTrack(track));
      setRemoteStream(newRemoteStream);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {localStream && (
          <RTCView streamURL={localStream.toURL()} style={styles.video} />
        )}
        {remoteStream && (
          <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
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
