import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  BounceIn,
  Easing,
  LinearTransition,
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

const placeholder = {
  id: "placeholder",
  name: "",
  image: "",
};

const data = new Array(20).fill(0).map((_, i) => ({
  id: `App ${i}`,
  name: `App ${i}`,
  image: "https://picsum.photos/64/64",
}));

export function ReorderApps() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(data);
  const [activeItemId, setActiveItemId] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (placeholderIndex === null) {
      return;
    }

    const newItems = [...items];

    // filter out all the previous placeholder items
    const filtered = newItems.filter((item) => item.id !== "placeholder");
    filtered.splice(placeholderIndex, 0, placeholder);
    setItems(filtered);
  }, [placeholderIndex]);

  const getActiveItem = () => {
    return data.find((item) => item.id === activeItemId);
  };

  const reorderItems = () => {
    const currentItem = getActiveItem();
    const newItems = [...items];

    // filter out all placeholder items
    const noPlaceholder = newItems.filter((item) => item.id !== "placeholder");
    // remove current item to avoid duplicates
    const noCurrentItem = noPlaceholder.filter(
      (item) => item.id !== currentItem?.id,
    );
    // insert current item to the placeholder index
    noCurrentItem.splice(placeholderIndex!, 0, currentItem!);
    setItems(noCurrentItem);
  };

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {items.map((app, index) =>
          app.id == "placeholder" ? (
            <View
              key={app.id}
              style={{ width: TILE_SIZE, height: TILE_SIZE }}
            />
          ) : (
            <Draggable
              key={app.id}
              id={app.id}
              setActiveItemId={setActiveItemId}
              setPlaceholderIndex={setPlaceholderIndex}
              setItems={setItems}
              reorderItems={reorderItems}
              index={index}
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
  id,
  setPlaceholderIndex,
  reorderItems,
  setActiveItemId,
  index,
}: any) {
  const [tileDimension, setDimenstions] = useState<any>();

  const pressed = useSharedValue(false);
  const offsetX = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      runOnJS(setActiveItemId)(id);
      runOnJS(setPlaceholderIndex)(index);
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
      runOnJS(setActiveItemId)(null);
      runOnJS(setPlaceholderIndex)(null);

      runOnJS(reorderItems)();
      offsetX.value = 0;
      offsetY.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 1.05 : 1, {
          duration: 150,
        }),
      },
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
    zIndex: pressed.value ? 1 : 0,
    position: pressed.value ? "absolute" : "relative",
    left: pressed.value ? tileDimension?.x : 0,
    top: pressed.value ? tileDimension?.y : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={animatedStyle}
        onLayout={(e) => setDimenstions(e.nativeEvent.layout)}
        layout={LinearTransition}
      >
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
