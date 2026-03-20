import Box from "@/components/Box";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useLocalSearchParams } from "expo-router";
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

export default function InformationDetail() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const [information, setInformation] = useState<Information | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`/information/${id}`)
        .then((response) => {
          setInformation(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch information details:", error);
        });
    }
  }, [id]);

  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Information Detail</Text>
      <Box>
        {information ? (
          <>
            <Text style={mainStyles.h2}>{information.titre}</Text>
            <Text>{information.texte}</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </Box>
    </View>
  );
}
