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
  box: {
    backgroundColor: colors.background_box,
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.1)",
  },
  box_cliquable: {
    backgroundColor: colors.background_box,
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.2)",
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
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
