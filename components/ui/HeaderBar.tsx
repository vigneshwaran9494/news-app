import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  showBackButton?: boolean;
  onBackPress?: () => void;
  title?: string;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
};

const HeaderBar = ({
  showBackButton = false,
  onBackPress = () => {},
  title = "",
  rightAction,
}: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        width: "100%",
        position: "absolute",
        paddingTop: insets.top,
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: colors.icon + "20", // 20% opacity
        borderBottomEndRadius: 32,
        borderBottomStartRadius: 32,
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <BlurView
        intensity={100}
        experimentalBlurMethod="dimezisBlurView"
        blurReductionFactor={80}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row" }}>
          {showBackButton ? (
            <Pressable
              onPress={onBackPress}
              style={({ pressed }) => [
                { padding: 8, alignItems: "center", justifyContent: "center" },
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text}
              />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        <View style={styles.titleContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
        </View>

        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons
              name={rightAction.icon}
              size={24}
              color={colors.text}
            />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 48,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 40,
  },
});

