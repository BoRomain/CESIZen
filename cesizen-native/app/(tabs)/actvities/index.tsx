import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { dateFormat } from "@/utils/dateFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ClickableBox from "@/components/ClickableBox";
import Box from "@/components/Box";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <View>
                <Text style={mainStyles.h3}>{activity.titre}</Text>
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
