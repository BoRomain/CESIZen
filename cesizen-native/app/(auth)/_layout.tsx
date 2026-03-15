import { colors } from "@/styles/colors";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[
          colors.primaryLight,
          colors.background_container,
          colors.secondaryLight,
        ]}
        style={{ flex: 1 }}
      >
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
      </LinearGradient>
    </>
  );
}
