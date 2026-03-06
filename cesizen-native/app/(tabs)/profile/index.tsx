import Button from "@/components/Button";
import mainStyles from "@/styles/mainStylesSheet";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Profile</Text>
      <Button title="Se connecter" onPress={() => router.push("/login")} />
      <Text style={mainStyles.h2}>ou</Text>
      <Button title="Créer un compte" onPress={() => router.push("/signup")} />
    </View>
  );
}
