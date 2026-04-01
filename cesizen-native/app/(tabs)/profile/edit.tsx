import Box from "@/components/Box";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { useUser } from "@/contexts/UserProvider";
import { colors } from "@/styles/colors";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser, loading } = useUser();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setNom(user.nom || "");
    setPrenom(user.prenom || "");
    setEmail(user.email || "");
  }, [user]);

  async function fetchCurrentUser() {
    const response = await axios.get("/utilisateur/get-user");
    setUser(response.data);
  }

  async function handleSaveProfile() {
    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`/utilisateur/update/${user.id}`, {
        nom,
        prenom,
        email,
        role: user.role,
        status: true,
      });
      await fetchCurrentUser();
      setSuccess("Profil mis à jour.");
      router.back();
    } catch {
      setError("Échec de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={mainStyles.container}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={mainStyles.container}>
        <Text style={mainStyles.text}>
          Connectez-vous pour modifier votre profil.
        </Text>
        <Button
          title="Se connecter"
          onPress={() => router.replace("/(auth)/login")}
          icon="log-in"
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={mainStyles.container}>
        <Text style={mainStyles.h1}>Modifier mon profil</Text>
        <Box>
          <TextField
            text="Prénom"
            value={prenom}
            onChangeText={setPrenom}
            editable={!saving}
            placeholder="Prénom"
          />
          <TextField
            text="Nom"
            value={nom}
            onChangeText={setNom}
            editable={!saving}
            placeholder="Nom"
          />
          <TextField
            text="Email"
            value={email}
            onChangeText={setEmail}
            editable={!saving}
            keyboardType="email-address"
            placeholder="Email"
          />

          {error ? <Text style={mainStyles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <View style={styles.actions}>
            <Button
              title="Annuler"
              onPress={() => router.back()}
              variant="secondary"
              icon="close"
              style={styles.actionButton}
            />
            <Button
              title="Enregistrer"
              onPress={handleSaveProfile}
              icon="save"
              loading={saving}
              disabled={saving}
              style={styles.actionButton}
            />
          </View>
        </Box>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  success: {
    color: colors.primary,
    marginBottom: 10,
  },
});
