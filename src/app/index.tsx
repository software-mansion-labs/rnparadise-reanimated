import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { Container } from "@/components/Container";
import { routes } from "@/lib/routes";
import { layout } from "@/lib/theme";
import { router } from "expo-router";
import { Preview } from "@/components/3DPreview";

export default function HomeScreen() {
  return <Preview />;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: layout.spacing * 2,
    paddingHorizontal: layout.radius,
    marginBottom: layout.spacing,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
    borderRadius: layout.radius,
  },
});
