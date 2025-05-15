import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import Animated from "react-native-reanimated";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const gallery = [
  "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

function Header() {
  const [isFocused, setFocus] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(
    undefined,
  );
  const inputRef = useRef<TextInput>(null);

  const handleCancel = () => {
    if (inputRef?.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }
  };

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          {
            transitionProperty: ["opacity", "marginTop"],
            transitionDuration: 200,
            transitionTimingFunction: "ease-in-out",
            opacity: isFocused ? 0 : 1,
            marginTop: isFocused ? -headerHeight! : 0,
          },
        ]}
        onLayout={(event) => {
          if (headerHeight === undefined) {
            setHeaderHeight(event.nativeEvent.layout.height);
          }
        }}
      >
        <Text style={styles.headerText}>tienda</Text>
      </Animated.View>
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <EvilIcons name="search" size={24} color="black" />
          <TextInput
            ref={inputRef}
            placeholder="Search"
            placeholderTextColor={"black"}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            style={styles.searchBarTextInput}
          />
        </View>
        <AnimatedPressable
          onPress={handleCancel}
          style={[
            styles.button,
            {
              transitionProperty: ["width", "marginLeft"],
              transitionDuration: 200,
              transitionTimingFunction: "ease-in-out",
              width: isFocused ? 50 : 0,
              marginLeft: isFocused ? 8 : 0,
            },
          ]}
        >
          <Text
            style={styles.buttonText}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            Cancel
          </Text>
        </AnimatedPressable>
      </View>
    </>
  );
}

function Gallery() {
  return (
    <View style={styles.gallery}>
      <FlatList
        data={gallery}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

function Details() {
  return (
    <View style={styles.content}>
      <View style={styles.popular}>
        <EvilIcons name="star" size={16} color="#475569" />
        <Text style={styles.popularText}>
          <Text style={styles.popularTextBold}>Popular</Text>! This item is
          trending now.
        </Text>
      </View>
      <Text style={styles.name}>Nike Air Max 1/97</Text>
      <Text style={styles.secondLine}>Sean Wotherspoon</Text>
      <Text style={styles.price}>$1955</Text>
    </View>
  );
}

function SelectSizeButton({ onPress }: { onPress: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => {
        setPressed(false);
        onPress();
      }}
    >
      <Animated.View
        style={[
          styles.selectSizeButton,
          pressed
            ? {
                animationDuration: 120,
                animationTimingFunction: "ease-in",
                animationFillMode: "forwards",
                animationName: {
                  "0%": { transform: [{ translateY: 0 }] },
                  "100%": { transform: [{ translateY: 6 }] },
                },
              }
            : {
                animationDuration: 120,
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
                animationName: {
                  "0%": { transform: [{ translateY: 6 }] },
                  "100%": { transform: [{ translateY: 0 }] },
                },
              },
        ]}
      >
        <Text style={styles.selectSizeButtonText}>Select Size</Text>
      </Animated.View>
      <Animated.View style={styles.buttonBackground} />
    </Pressable>
  );
}

export function Tienda() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <Gallery />
      <Details />
      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <SelectSizeButton onPress={() => {}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginHorizontal: 8,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Menlo",
    color: "#020617",
  },
  searchBarWrapper: {
    flexDirection: "row",
    maxWidth: Dimensions.get("window").width,
    marginHorizontal: 8,
  },
  searchBar: {
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
    color: "#d4d4d8",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#64748b",
    height: 50,
    flex: 1,
    paddingLeft: 4,
    gap: 10,
  },
  searchBarTextInput: {
    width: "100%",
    height: "100%",
  },
  button: {
    justifyContent: "center",
  },
  buttonText: {
    color: "#374151",
    fontWeight: "600",
  },
  gallery: {
    flex: 0.75,
    marginBottom: 8,
  },
  image: {
    margin: 8,
    width: Dimensions.get("window").width - 16,
    aspectRatio: 0.8,
  },
  gradient: {
    flex: 1,
    width: "300%",
    marginHorizontal: "-100%",
    [process.env.EXPO_OS === "web"
      ? "backgroundImage"
      : "experimental_backgroundImage"]:
      "linear-gradient(100deg, #f0f1f6 46%, #fafafa 50%, #f0f1f6 54%)",
  },
  price: {
    fontWeight: "bold",
    color: "#374151",
    fontSize: 22,
  },
  content: {
    marginHorizontal: 8,
    gap: 4,
  },
  sheet: {
    height: 100,
    width: "100%",
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  selectSizeButton: {
    backgroundColor: "#0f172a",
    padding: 10,
  },
  buttonBackground: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#0f172a",
    height: 38,
    transform: [{ translateY: -34 }, { translateX: 4 }],
    zIndex: -1,
  },
  selectSizeButtonText: {
    color: "white",
    fontSize: 18,
    // textAlign: "center",
    fontFamily: "Menlo",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  popular: {
    backgroundColor: "#f1f5f9",
    flexDirection: "row",
    padding: 6,
    gap: 4,
    marginBottom: 12,
    alignItems: "center",
  },
  popularText: {
    fontSize: 14,
    color: "#374151",
  },
  popularTextBold: {
    fontWeight: 600,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Menlo",
    textTransform: "uppercase",
  },
  secondLine: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
    fontFamily: "Menlo",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
