import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
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
  id: `App ${i}`,
  name: `App ${i}`,
  image: "https://picsum.photos/64/64",
}));

export function ReorderApps() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(data);
  const activeItemId = useSharedValue<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

  const reorderItems = () => {
    if (placeholderIndex === null || activeItemId.value === null) {
      return;
    }
    const currentItem = data.find((item) => item.id === activeItemId.value);
    if (!currentItem) {
      return;
    }

    const newItems = [...items];

    const activeIndex = newItems.findIndex(
      (item) => item.id === activeItemId.value,
    );
    newItems.splice(activeIndex, 1);
    newItems.splice(placeholderIndex, 0, currentItem);

    setItems(newItems);
  };

  useEffect(() => {
    reorderItems();
  }, [placeholderIndex]);

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {items.map((app, index) => (
          <Draggable
            key={app.id}
            id={app.id}
            activeItemId={activeItemId}
            setPlaceholderIndex={setPlaceholderIndex}
            setItems={setItems}
            reorderItems={reorderItems}
            index={index}
            initialPosition={{
              column: index % ITEMS_IN_ROW_COUNT,
              row: Math.floor(index / ITEMS_IN_ROW_COUNT),
            }}
          >
            <View style={styles.appContainer}>
              <Image source={{ uri: app.image }} style={styles.appIcon} />
              <Text style={styles.appName}>{app.name}</Text>
            </View>
          </Draggable>
        ))}
      </View>
    </View>
  );
}

interface Position {
  column: number;
  row: number;
}

function Draggable({
  children,
  id,
  setPlaceholderIndex,
  reorderItems,
  activeItemId,
  initialPosition,
}: any) {
  const [tileDimension, setDimenstions] = useState<any>();
  const currentPosition = useSharedValue<Position | null>(null);

  const pressed = useSharedValue(false);
  const offsetX = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      activeItemId.value = id;
    })
    .onChange((e) => {
      const column = Math.floor(e.absoluteX / (tileDimension?.width + GAP));
      const row = Math.floor(e.absoluteY / (tileDimension?.height + GAP));

      const newPlaceholderIndex = Math.min(
        column + row * ITEMS_IN_ROW_COUNT,
        data.length,
      );

      runOnJS(setPlaceholderIndex)(newPlaceholderIndex);

      offsetX.value += e.changeX;
      offsetY.value += e.changeY;

      currentPosition.value = {
        column,
        row,
      };
    })
    .onFinalize(() => {
      runOnJS(reorderItems)();

      // Cleanup
      pressed.value = false;
      offsetX.value = 0;
      offsetY.value = 0;
      activeItemId.value = null;
      runOnJS(setPlaceholderIndex)(null);
      currentPosition.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const adjustX = withTiming(
      currentPosition.value
        ? (initialPosition.column - currentPosition.value.column) *
            tileDimension?.width
        : 0,
    );
    const adjustY = withTiming(
      currentPosition.value
        ? (initialPosition.row - currentPosition.value.row) *
            tileDimension?.height
        : 0,
    );

    return {
      transform: [
        {
          scale: withTiming(pressed.value ? 1.09 : 1, {
            duration: 150,
          }),
        },
        { translateX: offsetX.value + adjustX },
        { translateY: offsetY.value + adjustY },
      ],
      zIndex: pressed.value ? 1 : 0,
    };
  });

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
    paddingLeft: GAP,
  },
  appContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  appIcon: {
    width: TILE_SIZE,
    aspectRatio: 1,
    borderRadius: 20,
    borderCurve: "continuous",
    marginBottom: 2,
  },
  appName: { fontSize: 14, color: "#fff" },
});
