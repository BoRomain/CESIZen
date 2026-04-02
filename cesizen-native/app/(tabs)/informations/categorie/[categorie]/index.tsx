import Box from "@/components/Box";
import ClickableBox from "@/components/ClickableBox";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { dateFormat } from "@/utils/dateFormat";
import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
  useNavigation,
  Stack,
} from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

interface Information {
  id: number;
  titre: string;
  description: string;
  texte: string;
  image: string;
  categorie: string;
  status: boolean;
  dateCreation: Date;
  dateModification: Date;
  authorId: number;
}

export default function InformationCategories() {
  const router = useRouter();
  const { categorie } = useLocalSearchParams<{
    categorie: string;
  }>();
  const [informations, setInformations] = useState<Information[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (categorie) {
      axios
        .get(`/information/categorie/${categorie}`)
        .then((response) => {
          setInformations(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch informations for category:", error);
        });
    }
  }, [categorie]);

  return (
    <View style={mainStyles.container}>
      <Stack.Screen
        options={{
          title: categorie ? `Catégorie : ${categorie}` : "Détails",
          headerShown: true,
        }}
      />
      <Box style={{ width: "100%", gap: 10 }}>
        {informations.length > 0 ? (
          informations.map((info) => (
            <ClickableBox
              key={info.id}
              onPress={() => router.push(`/informations/${info.id}`)}
            >
              <View>
                <Text style={mainStyles.h3}>{info.titre}</Text>
                <Text>{info.description}</Text>
              </View>
              {info.image && (
                <Image
                  source={{ uri: info.image }}
                  style={{ height: 50, borderRadius: 5 }}
                  resizeMode="cover"
                />
              )}
              <Text>
                <Ionicons name="calendar-outline" />
                {dateFormat(info.dateCreation)}
              </Text>
            </ClickableBox>
          ))
        ) : (
          <Text>Chargement...</Text>
        )}
      </Box>
    </View>
  );
}
