import * as THREE from "three";
import { View } from "react-native";

import { Canvas, useGPUContext } from "react-native-wgpu";
import { useEffect } from "react";
import { makeWebGPURenderer, useGLTF } from "@/lib/wgpu";

export function Preview() {
  const gltf = useGLTF(require("../../assets/shoe/shoe.gltf"));

  const { ref, context } = useGPUContext();
  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);

    camera.position.set(0, 0.2, 1);
    light.position.set(0, 0.1, 1);
    light.target.position.set(0, 0, 0);
    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene.add(light);
    scene.add(gltf.scene);

    function animateCamera() {
      const distance = 2;
      const elapsed = clock.getElapsedTime();

      camera.position.x = Math.sin(elapsed) * distance;
      camera.position.z = Math.cos(elapsed) * distance;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      light.position.x = camera.position.x;
      light.position.z = camera.position.z;
      light.target.position.set(0, 0, 0);
    }

    function animate() {
      animateCamera();
      renderer.render(scene, camera);
      context!.present();
    }

    renderer.setAnimationLoop(animate);
    return () => {
      renderer.setAnimationLoop(null);
    };
  }, [gltf, context]);

  return (
    <View style={{ flex: 0.75, justifyContent: "center" }}>
      <Canvas
        ref={ref}
        transparent={true}
        style={{ flex: 1, maxHeight: 450 }}
      />
    </View>
  );
}
