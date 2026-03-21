import Box from "@/components/Box";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

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
  const navigation = useNavigation();

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

  useEffect(() => {
    if (information) {
      navigation.setOptions({ title: information.titre });
    }
  }, [information]);

  return (
    <ScrollView>
      <View style={mainStyles.container}>
        <Box>
          {information ? (
            <>
              <Text style={mainStyles.h2}>{information.titre}</Text>
              {information.image && (
                <Image
                  source={{
                    uri: information.image,
                  }}
                  style={{ height: 200, borderRadius: 10 }}
                  resizeMode="cover"
                />
              )}
              <Text>{information.texte}</Text>
            </>
          ) : (
            <Text>Chargement...</Text>
          )}
        </Box>
      </View>
    </ScrollView>
  );
}
