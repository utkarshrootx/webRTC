import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ThemedView: React.FC<ThemedViewProps> = ({ children, style }) => {
  const colorScheme = useColorScheme() ?? "light";

  return <View style={[styles[colorScheme], style]}>{children}</View>;
};

const styles = StyleSheet.create({
  light: {
    backgroundColor: "#fff",
    padding: 10,
  },
  dark: {
    backgroundColor: "#333",
    padding: 10,
  },
});

export default ThemedView;
