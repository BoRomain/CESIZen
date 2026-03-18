import Box from "@/components/Box";
import mainStyles from "@/styles/mainStylesSheet";
import axios from "@/utils/axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function InformationCategories() {
  const { categorie } = useLocalSearchParams<{
    categorie: string;
  }>();

  return (
    <View style={mainStyles.container}>
      <Text style={mainStyles.h1}>{categorie}</Text>
      <Box>
        <Text style={mainStyles.h2}>Categorie: {categorie}</Text>
      </Box>
    </View>
  );
}
