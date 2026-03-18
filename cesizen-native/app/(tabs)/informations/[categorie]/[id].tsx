import Box from "@/components/Box";
import mainStyles from "@/styles/mainStylesSheet";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function InformationDetail() {
  const { categorie, id } = useLocalSearchParams<{
    categorie: string;
    id: string;
  }>();

  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Information Detail</Text>
      <Box>
        <Text style={mainStyles.h2}>Categorie: {categorie}</Text>
        <Text style={mainStyles.h2}>ID: {id}</Text>
      </Box>
    </View>
  );
}
