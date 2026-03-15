import Button from "@/components/Button";
import mainStyles from "@/styles/mainStylesSheet";
import axiosInstance from "@/utils/axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "@/styles/colors";

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
        <TextInput
          style={mainStyles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
          autoCapitalize="words"
          placeholderTextColor={colors.lightText}
        />
        <TextInput
          style={mainStyles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
          autoCapitalize="words"
          placeholderTextColor={colors.lightText}
        />
        <TextInput
          style={mainStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.lightText}
        />
        <TextInput
          style={mainStyles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.lightText}
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
