import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../styles/colors";

interface Props {
  children: React.ReactNode;
}

export default function Box({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background_box,
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.1)",
  },
});
