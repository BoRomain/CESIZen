import Box from "@/components/Box";
import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import ClickableBox from "@/components/ClickableBox";
import { useUser } from "@/contexts/UserProvider";
import { colors } from "@/styles/colors";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  async function fetchCurrentUser() {
    setRefreshing(true);
    setError("");
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
      setFavorites((prev) =>
        prev.filter((activity) => activity.id !== activityId),
      );
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

  useEffect(() => {
    fetchFavorites();
    if (!user) {
      setFavorites([]);
    }
  }, [fetchFavorites, user]);

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={mainStyles.container}>
          <Text style={mainStyles.h1}>Profil</Text>
          {loading ? (
            <Text>Chargement du profil...</Text>
          ) : user ? (
            <View style={{ display: "flex", gap: 10 }}>
              <Box>
                <Text style={mainStyles.h2}>Informatins personnelles</Text>
                <Text>Prénom: {user.prenom}</Text>
                <Text>Nom: {user.nom}</Text>
                <Text>Email: {user.email}</Text>
                {error ? <Text style={mainStyles.error}>{error}</Text> : null}
                <ButtonIcon
                  onPress={() => router.push("/(tabs)/profile/edit")}
                  icon="create-outline"
                />
              </Box>
              <Box>
                <View style={styles.favoriteHeader}>
                  <Text style={mainStyles.h2}>Mes favoris</Text>
                  <ButtonIcon
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
                          <Ionicons
                            name="bookmark"
                            size={20}
                            color={colors.primary}
                          />
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
                  title="Se déconnecter"
                  onPress={handleLogout}
                  variant="danger"
                  icon="log-out"
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={mainStyles.text}>
                Connectez-vous pour voir votre profil.
              </Text>
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
      </SafeAreaView>
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
});
