import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../styles/colors";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Box({ children, style }: Props) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.1)",
  },
});
