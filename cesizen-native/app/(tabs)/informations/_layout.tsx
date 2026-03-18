import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[categorie]" options={{ headerShown: false }} />
      <Stack.Screen name="[categorie]/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
