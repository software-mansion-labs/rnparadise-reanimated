import * as THREE from "three";
import { View, StyleSheet, Dimensions } from "react-native";

import { Canvas, useGPUContext } from "react-native-wgpu";
import { useEffect, useState } from "react";
import { makeWebGPURenderer, useGLTF } from "@/lib/wgpu";
import Animated, { FadeOut } from "react-native-reanimated";

function Loading() {
  return (
    <View style={styles.skeleton}>
      <Animated.View
        exiting={FadeOut}
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
  );
}

export function Preview() {
  const [ready, setReady] = useState(false);

  return (
    <View style={{ flex: 0.75, justifyContent: "center" }}>
      {!ready && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderCurve: "continuous",
    borderRadius: 12,
    overflow: "hidden",
    position: "absolute",
    left: 8,
    top: 8,
    width: Dimensions.get("window").width - 16,
    height: "95%",
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
});
