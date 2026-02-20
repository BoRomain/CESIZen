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

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: CustomButtonProps) {
  const getBackgroundColor = () => {
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
        { backgroundColor: getBackgroundColor() },
        { opacity: disabled || loading ? 0.6 : 1 },
        style,
      ]}
    >
      {loading && <ActivityIndicator style={styles.loading} color="#fff" />}

      <>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#fff"
            style={[styles.icon, { opacity: loading ? 0 : 1 }]}
          />
        )}
        <Text style={[styles.text, textStyle, { opacity: loading ? 0 : 1 }]}>
          {title}
        </Text>
      </>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
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
