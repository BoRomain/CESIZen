import { StyleSheet } from "react-native";
import { colors } from "./colors";

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_container,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Inter_400Regular",
  },
  h1: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  h2: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  h3: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});

export default mainStyles;
