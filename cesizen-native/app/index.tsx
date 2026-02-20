import Button from "@/components/Button";
import mainStyles from "@/styles/mainStylesSheet";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={mainStyles.container}>
      <Text style={mainStyles.h1}>Hello World</Text>
      <Text style={mainStyles.text}>Hello World</Text>
      <Button title="Ajouter" icon="add" onPress={() => console.log("Button pressed")} />
    </SafeAreaView>
  );
}
