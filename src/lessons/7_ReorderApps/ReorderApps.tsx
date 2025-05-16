import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ITEMS_IN_ROW_COUNT = 4;
const GAP = 16;

const TILE_SIZE =
  (Dimensions.get("screen").width - (ITEMS_IN_ROW_COUNT + 1) * GAP) /
  ITEMS_IN_ROW_COUNT;

const data = new Array(20).fill(0).map((_, i) => ({
  id: i,
  name: `App ${i}`,
  image: "https://picsum.photos/64/64",
}));

export function ReorderApps() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(data);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [tileDimension, setDimenstions] = useState<any>();

  useEffect(() => {
    if (placeholderIndex === null) {
      return;
    }

    // TODO: reorder elements
    // const newItems = [...items];
    // // filter empty items
    // const filtered = newItems.filter((item) => item !== null);
    // // add emtpy item to the placeholder index
    // if (activeIndex !== null) {
    //   filtered.splice(activeIndex, 1);
    // }

    // const activeItem = data.find((item) => item.id === activeIndex);
    // if (activeItem) {
    //   filtered.push(activeItem);
    // }
    // // filtered.splice(activeElementId.value, 1);
    // filtered.splice(placeholderIndex, 0, null);
    // setItems(filtered);
  }, [placeholderIndex, items]);

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {items.map((app) =>
          app == null ? (
            <View
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
              }}
            />
          ) : (
            <Draggable
              key={app.id}
              id={app.id}
              setActiveIndex={setActiveIndex}
              setPlaceholderIndex={setPlaceholderIndex}
              setItems={setItems}
              tileDimension={tileDimension}
              onLayout={(e) => setDimenstions(e.nativeEvent.layout)}
            >
              <View style={styles.appContainer}>
                <Image source={{ uri: app.image }} style={styles.appIcon} />
                <Text style={styles.appName}>{app.name}</Text>
              </View>
            </Draggable>
          ),
        )}
      </View>
    </View>
  );
}

function Draggable({
  children,
  activeElementId,
  id,
  setPlaceholderIndex,
  tileDimension,
  onLayout,
  setActiveIndex,
}: any) {
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      runOnJS(setActiveIndex)(id);
    })
    .onChange((e) => {
      offsetX.value += e.changeX;
      offsetY.value += e.changeY;

      const currentRow = Math.floor(e.absoluteX / (tileDimension?.width + GAP));
      const currentColumn = Math.floor(
        e.absoluteY / (tileDimension?.height + GAP),
      );

      const newPlaceholderIndex = Math.min(
        currentRow + currentColumn * ITEMS_IN_ROW_COUNT,
        data.length,
      );

      runOnJS(setPlaceholderIndex)(newPlaceholderIndex);
    })
    .onFinalize(() => {
      pressed.value = false;
      runOnJS(setActiveIndex)(null);
      runOnJS(setPlaceholderIndex)(null);

      // todod: reorder elements
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 1.05 : 1, {
          duration: 150,
          easing: Easing.inOut(Easing.quad),
        }),
      },
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
    zIndex: pressed.value ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    [process.env.EXPO_OS === "web"
      ? "backgroundImage"
      : "experimental_backgroundImage"]:
      "linear-gradient(180deg,rgba(125, 211, 252, 1) 0%, rgba(29, 78, 216, 1) 100%)",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  appContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  appIcon: {
    width: TILE_SIZE,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 2,
  },
  appName: { fontSize: 14, color: "#fff" },
});
