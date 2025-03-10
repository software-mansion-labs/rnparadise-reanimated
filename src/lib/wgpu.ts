import { useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";
import * as THREE from "three";
import { Image } from "react-native";
import type { NativeCanvas } from "react-native-wgpu";

export interface GLTF {
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  asset: {
    copyright?: string | undefined;
    generator?: string | undefined;
    version?: string | undefined;
    minVersion?: string | undefined;
    extensions?: any;
    extras?: any;
  };
  parser: any;
  userData: Record<string, any>;
}

const resolveAsset = (mod: ReturnType<typeof require>) => {
  // @ts-ignore
  return Image.resolveAssetSource(mod).uri;
};

export const debugManager = new THREE.LoadingManager();

function flipTexture(mesh: THREE.Mesh) {
  const mapsToFlip = [
    // typescript ignore next 4 lines please
    // @ts-ignore
    mesh.material.map, // Diffuse map
    // @ts-ignore
    mesh.material.normalMap, // Normal map
    // @ts-ignore
    mesh.material.roughnessMap, // Roughness map
    // @ts-ignore
    mesh.material.metalnessMap, // Metalness map
    // @ts-ignore
    mesh.material.aoMap, // Ambient occlusion map
  ];

  mapsToFlip.forEach((map) => {
    if (map) {
      map.wrapS = THREE.RepeatWrapping;
      // flip vertically
      map.repeat.y = -1;
      map.needsUpdate = true;
    }
  });
}

export const useGLTF = (asset: ReturnType<typeof require>) => {
  const [GLTF, setGLTF] = useState<GLTF | null>(null);
  const url = resolveAsset(asset);
  useEffect(() => {
    const loader = new GLTFLoader(debugManager);
    const dracoLoader = new DRACOLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(url, (model: GLTF) => {
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          flipTexture(child);
        }
      });
      setGLTF(model);
    });
  }, [url]);
  return GLTF;
};

// Here we need to wrap the Canvas into a non-host object for now
export class ReactNativeCanvas {
  constructor(private canvas: NativeCanvas) {}

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  set width(width: number) {
    this.canvas.width = width;
  }

  set height(height: number) {
    this.canvas.height = height;
  }

  get clientWidth() {
    return this.canvas.width;
  }

  get clientHeight() {
    return this.canvas.height;
  }

  set clientWidth(width: number) {
    this.canvas.width = width;
  }

  set clientHeight(height: number) {
    this.canvas.height = height;
  }

  addEventListener(_type: string, _listener: EventListener) {
    // TODO
  }

  removeEventListener(_type: string, _listener: EventListener) {
    // TODO
  }

  dispatchEvent(_event: Event) {
    // TODO
  }

  setPointerCapture() {
    // TODO
  }

  releasePointerCapture() {
    // TODO
  }
}

export const makeWebGPURenderer = (
  context: GPUCanvasContext,
  { antialias = true }: { antialias?: boolean } = {},
) => {
  return new THREE.WebGPURenderer({
    antialias,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    canvas: new ReactNativeCanvas(context.canvas),
    context,
  });
};
