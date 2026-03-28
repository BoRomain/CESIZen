import Box from "@/components/Box";
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

  return (
    <ScrollView>
      <View style={mainStyles.container}>
        <Box>
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
            </>
          ) : (
            <Text>Chargement...</Text>
          )}
        </Box>
      </View>
    </ScrollView>
  );
}
