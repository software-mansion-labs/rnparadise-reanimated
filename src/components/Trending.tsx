import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const trending = [
  "on sale",
  "new arrivals",
  "top rated",
  "best sellers",
  "most popular",
];

export function Trending() {
  const colorScheme = useColorScheme();

  return (
    <View>
      <Text
        style={[
          styles.header,
          colorScheme === "light" ? { color: "#334155" } : { color: "#e2e8f0" },
        ]}
      >
        Trending searches
      </Text>
      <View style={styles.wrapper}>
        {trending.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.textWrapper,
              colorScheme === "light"
                ? { borderColor: "#cbd5e1" }
                : { backgroundColor: "#334155" },
            ]}
          >
            <Text
              style={[
                styles.text,
                colorScheme === "light"
                  ? { color: "#64748b" }
                  : { color: "#f1f5f9" },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 12,
  },
  textWrapper: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 4,
  },
  text: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  wrapper: {
    gap: 6,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
