import Button from "@/components/Button";
import mainStyles from "@/styles/mainStylesSheet";
import axiosInstance from "@/utils/axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "@/styles/colors";
import ButtonIcon from "@/components/ButtonIcon";
import TextField from "@/components/TextField";

export default function Signup() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/utilisateur/create", {
        nom,
        prenom,
        email,
        password,
      });
      router.replace("/(auth)/login");
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={mainStyles.container}>
      <View style={mainStyles.formContainer}>
        <Text style={mainStyles.h1}>Signup</Text>
        <ButtonIcon
          onPress={() => router.replace("/(tabs)/profile")}
          icon="arrow-back"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <TextField
          text="Nom"
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextField
          text="Prénom"
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
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
          title="Signup"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          icon="log-in"
        />
        <Text
          style={mainStyles.link}
          onPress={() => router.push("/(auth)/login")}
        >
          Already have an account? Login
        </Text>
      </View>
    </View>
  );
}
