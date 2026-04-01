import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../styles/colors";

interface Props {
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  padding?: number;
}

export default function ButtonIcon({
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  padding = 12,
}: Props) {
  const getColor = () => {
    if (disabled) return colors.lightText;
    switch (variant) {
      case "secondary":
        return colors.secondary;
      case "danger":
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.6}
      style={[
        styles.container,
        { opacity: disabled || loading ? 0.6 : 1 },
        { padding },
        style,
      ]}
    >
      {loading && <ActivityIndicator style={styles.loading} color="#fff" />}

      <>
        <Ionicons
          name={icon}
          size={24}
          color={getColor()}
          style={[styles.icon, { opacity: loading ? 0 : 1 }]}
        />
      </>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  icon: {
    marginRight: 8,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1.5 }],
  },
});
