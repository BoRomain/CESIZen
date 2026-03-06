import mainStyles from "@/styles/mainStylesSheet";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Activities() {
  const router = useRouter();
  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>Activities</Text>
    </View>
  );
}
