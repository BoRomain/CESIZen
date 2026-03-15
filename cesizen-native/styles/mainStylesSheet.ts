import { StyleSheet } from "react-native";
import { colors } from "./colors";

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Inter_400Regular",
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    alignItems: "center",
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.1)",
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
  input: {
    width: "100%",
    height: 50,
    backgroundColor: colors.background_container,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    marginBottom: 10,
  },
  link: {
    color: colors.primary,
    marginTop: 15,
  },
});

export default mainStyles;
