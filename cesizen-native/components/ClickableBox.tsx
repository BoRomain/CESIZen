import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../styles/colors";

interface Props {
  onPress?: () => void;
}

export default function ClickableBox({ onPress = () => {} }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6}></TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background_box,
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgb(0, 0, 0, 0.2)",
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },
});
