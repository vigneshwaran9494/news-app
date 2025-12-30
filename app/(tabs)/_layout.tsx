import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { wp } from '@/utils/dimensions';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            experimentalBlurMethod="dimezisBlurView"
            blurReductionFactor={100}
            tint={colorScheme === "light" ? "light" : "dark"}
            style={{
              ...StyleSheet.absoluteFillObject, // Fills the parent view
              overflow: "hidden",
              
              borderTopEndRadius: wp(10),
              borderTopStartRadius: wp(10),
            }}
          />
        ),
        tabBarHideOnKeyboard: false,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: wp(0.1),
          borderLeftWidth: wp(0.1),
          borderRightWidth: wp(0.1),
          borderTopEndRadius: wp(10),
          borderTopStartRadius: wp(10),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Headlines',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
    </Tabs>
  );
}
