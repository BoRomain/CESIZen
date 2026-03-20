import Box from "@/components/Box";
import ClickableBox from "@/components/ClickableBox";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface Information {
  id: number;
  titre: string;
  description: string;
  texte: string;
  image: string;
  categorie: string;
  status: boolean;
  dateCreation: string;
  dateModification: string;
  authorId: number;
}

export default function InformationCategories() {
  const router = useRouter();
  const { categorie } = useLocalSearchParams<{
    categorie: string;
  }>();
  const [informations, setInformations] = useState<Information[]>([]);

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
      <Text style={mainStyles.h1}>{categorie}</Text>
      <Box>
        {informations.length > 0 ? (
          informations.map((info) => (
            <ClickableBox
              key={info.id}
              onPress={() => router.push(`/informations/${info.id}`)}
            >
              <Text style={mainStyles.h3}>{info.titre}</Text>
              <Text>{info.description?.substring(0, 100)}...</Text>
            </ClickableBox>
          ))
        ) : (
          <Text>No information found for this category.</Text>
        )}
      </Box>
    </View>
  );
}
