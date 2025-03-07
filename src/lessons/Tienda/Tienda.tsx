import { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tienda() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const cancelRef = useRef<View>(null);
  const [isFocused, setFocus] = useState(false);
  const [headerHeight, setHeaderHeight] = useState<number | undefined>(
    undefined,
  );
  const [pressed, setPressed] = useState(false);
  const cartRef = useAnimatedRef();
  const dotRef = useAnimatedRef();
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const finalOffsetX = useSharedValue(0);
  const finalOffsetY = useSharedValue(0);
  const [counter, setCounter] = useState(0);

  const handleCancel = () => {
    if (inputRef?.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }
  };

  useLayoutEffect(() => {
    runOnUI(() => {
      const cartMeasurement = measure(cartRef);
      const dotMeasurement = measure(dotRef);

      if (!cartMeasurement || !dotMeasurement) {
        return;
      }

      finalOffsetX.value = -dotMeasurement?.pageX + cartMeasurement?.pageX;
      finalOffsetY.value = -dotMeasurement?.pageY + cartMeasurement?.pageY;
    })();
  }, []);

  const handleDotAnimate = () => {
    offsetX.value = withSpring(finalOffsetX.value, {
      stiffness: 60,
      damping: 15,
    });
    offsetY.value = withSpring(
      finalOffsetY.value,
      {
        stiffness: 60,
        damping: 15,
        restDisplacementThreshold: 200,
      },
      () => {
        offsetY.value = 0;
        offsetX.value = 0;
        runOnJS(setCounter)(counter + 1);
      },
    );
  };

  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
      opacity: interpolate(
        offsetX.value,
        [0, finalOffsetX.value * 0.8, finalOffsetX.value],
        [1, 1, 0],
      ),
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <Animated.View style={styles.cart} ref={cartRef}>
          <FontAwesome name="shopping-cart" size={16} color="#450a0a" />

          {counter > 0 && (
            <Animated.View style={styles.counter} entering={FadeIn}>
              <Text style={styles.counterText}>{counter}</Text>
            </Animated.View>
          )}
        </Animated.View>
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
      <View style={styles.skeleton}>
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
      </View>
      <View style={styles.content}>
        <Text style={styles.price}>$99.9</Text>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => {
            setPressed(false);
            handleDotAnimate();
          }}
        >
          <Animated.View
            style={[
              styles.buyButton,
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
            <Text style={styles.buyButtonText}>Buy</Text>
          </Animated.View>
          <Animated.View style={styles.buttonBackground} />
        </Pressable>
      </View>
      <Animated.View style={[styles.dot, dotAnimatedStyle]} ref={dotRef} />
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
  cart: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f1f6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Menlo",
    color: "#7f1d1d",
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
      "linear-gradient(100deg, #f0f1f6 46%, #fafafa 50%, #f0f1f6 54%)",
  },
  price: {
    fontSize: 22,
    fontFamily: "Menlo",
  },
  content: {
    marginHorizontal: 8,
  },
  sheet: {
    height: 100,
    width: "100%",
    backgroundColor: "#f0f1f6",
    position: "absolute",
    zIndex: 100,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  buyButton: {
    backgroundColor: "rgb(208, 49, 49)",
    padding: 8,
    borderRadius: 8,
  },
  buttonBackground: {
    backgroundColor: "rgb(165, 41, 41)",
    borderRadius: 8,
    height: 40,
    transform: [{ translateY: -32 }],
    zIndex: -1,
  },
  buyButtonText: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Menlo",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgb(208, 49, 49)",
    position: "absolute",
    zIndex: 5,
    left: "53%",
    bottom: 10,
  },
  counter: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "rgb(208, 49, 49)",
    borderRadius: 8,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Menlo",
  },
});
