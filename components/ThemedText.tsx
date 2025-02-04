import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ThemedTextProps {
  type?: "default" | "defaultSemiBold" | "title" | "subtitle";
  children: React.ReactNode;
}

const styleMap: Record<
  "default" | "defaultSemiBold" | "title" | "subtitle",
  TextStyle
> = {
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
};

const ThemedText: React.FC<ThemedTextProps> = ({
  type = "default",
  children,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return <Text style={[styleMap[type], styles[colorScheme]]}>{children}</Text>;
};

const styles = StyleSheet.create({
  light: {
    color: "#000",
  },
  dark: {
    color: "#fff",
  },
});

export default ThemedText;
