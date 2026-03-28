import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { dateFormat } from "@/utils/dateFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ClickableBox from "@/components/ClickableBox";
import Box from "@/components/Box";
import { useUser } from "@/contexts/UserProvider";
import { colors } from "@/styles/colors";

interface Activity {
  id: number;
  titre: string;
  description: string;
  duree: number;
  difficulte: number;
  image: string | null;
  type: string;
  status: boolean;
  dateCreation: Date;
  dateModification: Date;
  authorId: number;
}

export default function Activities() {
  const router = useRouter();
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get("/activiteDetente", {
        params: {
          page: 1,
          limit: 100,
        },
      })
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch activities:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    axios
      .get("/favori/ids")
      .then((response) => {
        setFavoriteIds(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch favorites:", error);
      });
  }, [user]);

  async function toggleFavorite(activityId: number) {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    const isFavorite = favoriteIds.includes(activityId);
    try {
      if (isFavorite) {
        await axios.delete(`/favori/${activityId}`);
        setFavoriteIds((prev) => prev.filter((id) => id !== activityId));
      } else {
        await axios.post(`/favori/${activityId}`);
        setFavoriteIds((prev) => [...prev, activityId]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={mainStyles.container}>
      <Text style={mainStyles.h1}>Activités Détente</Text>
      <Box>
        {isLoading ? (
          <Text>Chargement...</Text>
        ) : (
          activities.map((activity) => (
            <ClickableBox
              key={activity.id}
              onPress={() => router.push(`/actvities/${activity.id}`)}
            >
              <View style={styles.row}>
                <Text style={mainStyles.h3}>{activity.titre}</Text>
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    toggleFavorite(activity.id);
                  }}
                  hitSlop={8}
                >
                  <Ionicons
                    name={favoriteIds.includes(activity.id) ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
              <View>
                <Text>{activity.description}</Text>
              </View>
              {activity.image && (
                <Image
                  source={{ uri: activity.image }}
                  style={{ height: 120, borderRadius: 5 }}
                  resizeMode="cover"
                />
              )}
              <Text>
                <Ionicons name="time-outline" /> {activity.duree} min
              </Text>
              <Text>
                <Ionicons name="fitness-outline" /> Difficulté: {activity.difficulte}/5
              </Text>
              <Text>
                <Ionicons name="pricetag-outline" /> {activity.type}
              </Text>
              <Text>
                <Ionicons name="calendar-outline" /> {dateFormat(activity.dateCreation)}
              </Text>
            </ClickableBox>
          ))
        )}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
});
