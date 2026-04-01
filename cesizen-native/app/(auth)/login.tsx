import Button from "@/components/Button";
import { useUser } from "@/contexts/UserProvider";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "@/styles/colors";
import ButtonIcon from "@/components/ButtonIcon";
import TextField from "@/components/TextField";

export default function Login() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/utilisateur/login", {
        email,
        password,
      });
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      const userResponse = await axios.get("/utilisateur/get-user");
      setUser(userResponse.data);
      router.replace("/(tabs)/informations");
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={mainStyles.container}>
      <View style={mainStyles.formContainer}>
        <Text style={mainStyles.h1}>Login</Text>
        <ButtonIcon
          onPress={() => router.replace("/(tabs)/profile")}
          icon="arrow-back"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <TextField
          text="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextField
          text="Mot de passe"
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={mainStyles.error}>{error}</Text> : null}
        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          icon="log-in"
        />
        <Text
          style={mainStyles.link}
          onPress={() => router.push("/(auth)/signup")}
        >
          Don't have an account? Signup
        </Text>
      </View>
    </View>
  );
}
