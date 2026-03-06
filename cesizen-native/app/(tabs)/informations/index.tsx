import Box from "@/components/Box";
import mainStyles from "@/styles/mainStylesSheet";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Informations() {
  const router = useRouter();
  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Informations</Text>
      <Box>
        <Text style={mainStyles.h2}>Les infos à la une</Text>
      </Box>
    </View>
  );
}
