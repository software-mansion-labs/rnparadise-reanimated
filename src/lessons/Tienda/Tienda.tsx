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
import Animated from "react-native-reanimated";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tienda() {
  const inputRef = useRef<TextInput>(null);
  const cancelRef = useRef<View>(null);
  const [isFocused, setFocus] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(
    undefined,
  );

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
    height: 42,
    flex: 1,
    borderRadius: 8,
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
});
