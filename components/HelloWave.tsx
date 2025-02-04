import React from "react";
import { Text, View, StyleSheet } from "react-native";

export const HelloWave = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👋 Hello, WebRTC!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HelloWave;
