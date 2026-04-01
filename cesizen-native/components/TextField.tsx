import mainStyles from "@/styles/mainStylesSheet";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface Props {
  text?: string;
  value: string;
  placeholder?: string;
  onChangeText: any;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}

export default function TextField({
  text = "",
  value,
  onChangeText,
  editable = true,
  placeholder = "",
  keyboardType = "default",
  secureTextEntry,
}: Props) {
  return (
    <View style={{ width: "100%" }}>
      <Text>{text}</Text>
      <TextInput
        style={mainStyles.input}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
