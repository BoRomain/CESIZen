import Box from "@/components/Box";
import ClickableBox from "@/components/ClickableBox";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Informations() {
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("/information/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Informations</Text>
      <Box>
        <Text style={mainStyles.h2}>Catégories</Text>
        {categories.map((categorie, index) => (
          <ClickableBox
            key={index}
            onPress={() => router.push(`/informations/categorie/${categorie}`)}
          >
            <Text style={mainStyles.h3}>{categorie}</Text>
          </ClickableBox>
        ))}
      </Box>
    </View>
  );
}
