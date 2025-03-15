import * as THREE from "three";
import { View, StyleSheet, Dimensions } from "react-native";

import { Canvas, useGPUContext } from "react-native-wgpu";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeWebGPURenderer, useGLTF } from "@/lib/wgpu";
import Animated, {
  FadeOut,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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
  const gltf = useGLTF(require("./assets/shoe/shoe.gltf"));
  const [ready, setReady] = useState(false);
  const translation = useRef(0);
  const wasRunning = useRef(false);
  const clock = useMemo(() => {
    const clock = new THREE.Clock();
    clock.autoStart = false;
    return clock;
  }, []);

  const { ref, context } = useGPUContext();
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      wasRunning.current = clock.running;
      clock.stop();
    })
    .onChange((e) => {
      translation.current += e.changeX;
    })
    .onEnd(() => {
      if (wasRunning.current) {
        clock.start();
      }
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => {
      clock.running ? clock.stop() : clock.start();
    });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);

    camera.position.set(0, 0.2, 2);
    light.position.set(0, 0.1, 1);
    light.target.position.set(0, 0, 0);
    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene.add(light);
    scene.add(gltf.scene);

    let elapsed = 0;
    clock.start();
    function animateCamera() {
      const distance = 2;
      elapsed += clock.getDelta();

      camera.position.x =
        Math.sin(elapsed - (Math.PI * translation.current) / width) * distance;
      camera.position.z =
        Math.cos(elapsed - (Math.PI * translation.current) / width) * distance;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      light.position.x = camera.position.x;
      light.position.z = camera.position.z;
      light.target.position.set(0, 0, 0);
    }

    function animate() {
      animateCamera();
      renderer.render(scene, camera);
      context!.present();
      if (!ready) {
        setReady(true);
      }
    }

    renderer.setAnimationLoop(animate);
    return () => {
      renderer.setAnimationLoop(null);
    };
  }, [gltf, context]);

  return (
    <View style={{ flex: 0.75, justifyContent: "center" }}>
      {!ready && <Loading />}
      <GestureDetector gesture={gesture}>
        <Canvas
          ref={ref}
          transparent={true}
          style={{ flex: 1, maxHeight: 450, margin: 20 }}
        />
      </GestureDetector>
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
