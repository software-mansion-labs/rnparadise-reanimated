import * as THREE from "three";
import { View } from "react-native";

import { makeWebGPURenderer } from "./makeGPURenderer";
import { Canvas, useCanvasEffect } from "react-native-wgpu";

window.parent = window;

export function Preview() {
  const ref = useCanvasEffect(async () => {
    const context = ref.current!.getContext("webgpu")!;
    const { width, height } = context.canvas;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = makeWebGPURenderer(context);
    console.log("Renderer");
    await renderer.init();
    console.log("Renderer initialized");
    function animate(time: number) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;

      renderer.render(scene, camera);
      context.present();
    }
    renderer.setAnimationLoop(animate);
    return () => {
      renderer.setAnimationLoop(null);
    };
  });

  return (
    <View style={{ flex: 0.75 }}>
      <Canvas ref={ref} style={{ flex: 1 }} />
    </View>
  );
}
