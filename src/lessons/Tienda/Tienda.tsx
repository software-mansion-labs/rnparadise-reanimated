import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  Keyframe,
  LinearTransition,
  ZoomInLeft,
} from "react-native-reanimated";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Preview } from "@/components/3DPreview";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const stretch = new Keyframe({
  0: {
    width: 0,
  },
  100: {
    width: 92,
  },
});

export function Tienda() {
  const inputRef = useRef<TextInput>(null);
  const cancelRef = useRef<View>(null);
  const [isFocused, setFocus] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(
    undefined,
  );
  const [priceWidth, setPriceWidth] = useState<number | undefined>(undefined);

  const onCancel = () => {
    if (inputRef?.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <FontAwesome name="opencart" size={26} color="#f97316" />
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
          ref={cancelRef}
          onPress={onCancel}
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
      <Preview />
      {/* <View style={styles.skeleton}>
        <Animated.View
          style={[
            styles.gradient,
            {
              animationName: {
                from: {
                  transform: [{ translateX: "-25%" }],
                },
                to: {
                  transform: [{ translateX: "25%" }],
                },
              },
              animationDuration: "1s",
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            },
          ]}
        />
      </View> */}
      <Animated.View style={[styles.line]} />

      <Text style={styles.price}>$99.9</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    // height: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 8,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Menlo",
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
    color: "#64748b",
    backgroundColor: "#f0f1f6",
    height: 50,
    flex: 1,
    borderRadius: 12,
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
    color: "#3b82f6",
    fontWeight: "bold",
  },
  skeleton: {
    margin: 8,
    width: Dimensions.get("window").width - 16,
    aspectRatio: 0.8,
    borderCurve: "continuous",
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    width: "300%",
    marginHorizontal: "-100%",
    [process.env.EXPO_OS === "web"
      ? "backgroundImage"
      : "experimental_backgroundImage"]:
      "linear-gradient(100deg, #ebeff5 46%, #fafafa 50%, #ebeff5 54%)",
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Menlo",
  },
  line: {
    position: "relative",
    top: 20,
    height: 6,
    width: 92,
    transform: [{ rotate: "-8deg" }],
    backgroundColor: "red",
    marginHorizontal: 8,
  },
});
