import React from "react";
import { ScrollView, View, ImageBackground, StyleSheet } from "react-native";

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  backgroundImage?: any;
  headerBackgroundColor?: { light: string; dark: string };
  headerImage?: JSX.Element;
}

const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  children,
  backgroundImage,
  headerBackgroundColor,
  headerImage,
}) => {
  return (
    <ScrollView>
      <View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor?.light },
        ]}>
        {headerImage}
      </View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
});

export default ParallaxScrollView;
