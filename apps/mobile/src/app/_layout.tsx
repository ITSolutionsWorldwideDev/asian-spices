// src/app/_layout.tsx

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { NunitoSans_400Regular, NunitoSans_700Bold } from "@expo-google-fonts/nunito-sans";
import { Text } from "react-native";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or splash loader
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}