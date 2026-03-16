import Button from "@/components/Button";
import { useUser } from "@/contexts/UserProvider";
import mainStyles from "@/styles/mainStylesSheet";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useUser();

  function handleLogout() {
    SecureStore.deleteItemAsync("accessToken");
    setUser(null);
    router.replace("/(auth)/login");
  }
  return (
    <View style={mainStyles.container}>
      {user ? (
        <>
          <Text style={mainStyles.h1}>Profile</Text>
          <Button
            title="Se deconnecter"
            onPress={handleLogout}
            variant="danger"
            icon="log-out"
          />
        </>
      ) : (
        <>
          <Text style={mainStyles.h1}>Profile</Text>
          <Button title="Se connecter" onPress={() => router.push("/login")} />
          <Text style={mainStyles.h2}>ou</Text>
          <Button
            title="Créer un compte"
            onPress={() => router.push("/signup")}
          />
        </>
      )}
    </View>
  );
}
