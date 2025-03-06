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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tienda() {
  const inputRef = useRef<TextInput>(null);
  const cancelRef = useRef<View>(null);
  const [isFocused, setFocus] = useState(false);

  const onCancel = () => {
    if (inputRef?.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              transitionDuration: 300,
              transitionTimingFunction: "ease-in-out",
              width: isFocused ? 60 : 0,
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
    alignItems: "center",
  },
  buttonText: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
});
