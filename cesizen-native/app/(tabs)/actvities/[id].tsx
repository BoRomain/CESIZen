import Box from "@/components/Box";
import Button from "@/components/Button";
import { useUser } from "@/contexts/UserProvider";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

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

export default function ActivityDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [activity, setActivity] = useState<Activity | null>(null);
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/activiteDetente/${id}`)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch activity details:", error);
      });
  }, [id]);

  useEffect(() => {
    if (activity) {
      navigation.setOptions({ title: activity.titre });
    }
  }, [activity, navigation]);

  useEffect(() => {
    if (!user || !id) {
      setIsFavorite(false);
      return;
    }

    axios
      .get("/favori/ids")
      .then((response) => {
        const ids = response.data as number[];
        setIsFavorite(ids.includes(Number(id)));
      })
      .catch((error) => {
        console.error("Failed to fetch favorites:", error);
      });
  }, [id, user]);

  async function toggleFavorite() {
    if (!user || !activity) return;

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`/favori/${activity.id}`);
        setIsFavorite(false);
      } else {
        await axios.post(`/favori/${activity.id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  }

  return (
    <ScrollView>
      <View style={mainStyles.container}>
        <Box style={{ width: "100%" }}>
          {activity ? (
            <>
              <Text style={mainStyles.h2}>{activity.titre}</Text>
              {activity.image && (
                <Image
                  source={{ uri: activity.image }}
                  style={{ height: 220, borderRadius: 10 }}
                  resizeMode="cover"
                />
              )}
              <Text>{activity.description}</Text>
              <Text>Type: {activity.type}</Text>
              <Text>Durée: {activity.duree} min</Text>
              <Text>Difficulté: {activity.difficulte}/5</Text>
              {user ? (
                <Button
                  title={
                    isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                  }
                  onPress={toggleFavorite}
                  icon={isFavorite ? "bookmark" : "bookmark-outline"}
                  loading={favoriteLoading}
                  disabled={favoriteLoading}
                />
              ) : null}
            </>
          ) : (
            <Text>Chargement...</Text>
          )}
        </Box>
      </View>
    </ScrollView>
  );
}
