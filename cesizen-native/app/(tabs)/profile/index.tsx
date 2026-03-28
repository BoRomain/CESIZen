import Button from "@/components/Button";
import { useUser } from "@/contexts/UserProvider";
import { colors } from "@/styles/colors";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Box from "@/components/Box";
import ClickableBox from "@/components/ClickableBox";
import { Ionicons } from "@expo/vector-icons";

interface Activity {
  id: number;
  titre: string;
  description: string;
  duree: number;
  difficulte: number;
  image: string | null;
  type: string;
  status: boolean;
  dateCreation: string;
  dateModification: string;
  authorId: number;
}

export default function Profile() {
  const router = useRouter();
  const { user, setUser, loading } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  useEffect(() => {
    if (!user) return;
    setNom(user.nom || "");
    setPrenom(user.prenom || "");
    setEmail(user.email || "");
  }, [user]);

  async function fetchCurrentUser() {
    setRefreshing(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.get("/utilisateur/get-user");
      setUser(response.data);
    } catch {
      setError("Impossible de charger le profil.");
    } finally {
      setRefreshing(false);
    }
  }

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setFavoritesLoading(true);
    setFavoritesError("");
    try {
      const response = await axios.get("/favori");
      const activities = response.data.map(
        (item: { activiteDetente: Activity }) => item.activiteDetente,
      );
      setFavorites(activities);
    } catch {
      setFavoritesError("Impossible de charger les favoris.");
    } finally {
      setFavoritesLoading(false);
    }
  }, [user]);

  async function handleRemoveFavorite(activityId: number) {
    try {
      await axios.delete(`/favori/${activityId}`);
      setFavorites((prev) => prev.filter((activity) => activity.id !== activityId));
    } catch {
      setFavoritesError("Impossible de retirer le favori.");
    }
  }

  function handleLogout() {
    SecureStore.deleteItemAsync("accessToken");
    setUser(null);
    setFavorites([]);
    router.replace("/(auth)/login");
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
      setIsEditing(false);
      setSuccess("Profil mis à jour.");
    } catch {
      setError("Échec de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
    if (!user) {
      setFavorites([]);
    }
  }, [fetchFavorites, user]);

  return (
    <ScrollView>
      <View style={mainStyles.container}>
        <Text style={mainStyles.h1}>Profil</Text>
        {loading ? (
          <Text>Chargement du profil...</Text>
        ) : user ? (
          <>
            <Box>
              <Text style={mainStyles.h2}>
                {user.prenom} {user.nom}
              </Text>
              <Text>{user.email}</Text>
              <Text style={styles.role}>Rôle: {user.role}</Text>
            </Box>
            <Box>
              <Text style={mainStyles.h2}>Informations personnelles</Text>
              <TextInput
                style={[mainStyles.input, !isEditing && styles.readOnlyInput]}
                value={prenom}
                onChangeText={setPrenom}
                editable={isEditing}
                placeholder="Prénom"
                placeholderTextColor={colors.lightText}
              />
              <TextInput
                style={[mainStyles.input, !isEditing && styles.readOnlyInput]}
                value={nom}
                onChangeText={setNom}
                editable={isEditing}
                placeholder="Nom"
                placeholderTextColor={colors.lightText}
              />
              <TextInput
                style={[mainStyles.input, !isEditing && styles.readOnlyInput]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor={colors.lightText}
              />
              {error ? <Text style={mainStyles.error}>{error}</Text> : null}
              {success ? <Text style={styles.success}>{success}</Text> : null}
              {isEditing ? (
                <View style={styles.actions}>
                  <Button
                    title="Annuler"
                    onPress={() => {
                      setIsEditing(false);
                      setError("");
                      setSuccess("");
                      if (user) {
                        setNom(user.nom || "");
                        setPrenom(user.prenom || "");
                        setEmail(user.email || "");
                      }
                    }}
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
              ) : (
                <Button
                  title="Modifier mon profil"
                  onPress={() => setIsEditing(true)}
                  icon="create-outline"
                />
              )}
            </Box>
            <Box>
              <View style={styles.favoriteHeader}>
                <Text style={mainStyles.h2}>Mes favoris</Text>
                <Button
                  title="Actualiser"
                  onPress={fetchFavorites}
                  variant="secondary"
                  icon="refresh"
                  loading={favoritesLoading}
                  disabled={favoritesLoading}
                  padding={8}
                />
              </View>
              {favoritesError ? (
                <Text style={mainStyles.error}>{favoritesError}</Text>
              ) : null}
              {favoritesLoading ? (
                <Text>Chargement...</Text>
              ) : favorites.length > 0 ? (
                favorites.map((activity) => (
                  <ClickableBox
                    key={activity.id}
                    onPress={() => router.push(`/actvities/${activity.id}`)}
                  >
                    <View style={styles.favoriteRow}>
                      <Text style={mainStyles.h3}>{activity.titre}</Text>
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation();
                          handleRemoveFavorite(activity.id);
                        }}
                        hitSlop={8}
                        style={styles.favoriteRemove}
                      >
                        <Ionicons name="bookmark" size={20} color={colors.primary} />
                      </Pressable>
                    </View>
                    {activity.image && (
                      <Image
                        source={{ uri: activity.image }}
                        style={{ height: 120, borderRadius: 5 }}
                        resizeMode="cover"
                      />
                    )}
                    <Text>{activity.description}</Text>
                  </ClickableBox>
                ))
              ) : (
                <Text>Aucun favori pour le moment.</Text>
              )}
            </Box>
            <View style={styles.actions}>
              <Button
                title="Actualiser"
                onPress={fetchCurrentUser}
                variant="secondary"
                icon="refresh"
                loading={refreshing}
                disabled={refreshing}
                style={styles.actionButton}
              />
              <Button
                title="Se déconnecter"
                onPress={handleLogout}
                variant="danger"
                icon="log-out"
                style={styles.actionButton}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={mainStyles.text}>Connectez-vous pour voir votre profil.</Text>
            <Button
              title="Se connecter"
              onPress={() => router.push("/(auth)/login")}
              icon="log-in"
            />
            <Text style={mainStyles.h2}>ou</Text>
            <Button
              title="Créer un compte"
              onPress={() => router.push("/(auth)/signup")}
              icon="person-add"
            />
          </>
        )}
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
  role: {
    marginTop: 8,
    color: colors.lightText,
  },
  favoriteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  favoriteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  favoriteRemove: {
    padding: 6,
  },
  readOnlyInput: {
    backgroundColor: "#f6f6f6",
  },
  success: {
    color: colors.primary,
    marginBottom: 10,
  },
});
