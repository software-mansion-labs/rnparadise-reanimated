# Tienda

In this workshop, you'll learn how to create a modern e-commerce interface using React Native Reanimated and React Native WGPU. We'll focus on building smooth, performant animations and implementing a 3D product preview. You'll learn about:

- Advanced animation techniques using Reanimated's brand new CSS transitions and CSS animations
- Working with shared values and animated refs for complex animations
- Setting up a WebGPU rendering pipeline with Three.js
- Creating 3D experiences in React Native

https://github.com/user-attachments/assets/943c32ee-b11a-40df-99c8-d66cbd672896

# Part 1 - The shop

In this section, we'll build the core shopping interface. We'll focus on creating smooth, responsive animations that enhance the user experience. You'll learn how to:

- Implement header animations that respond to user input
- Create staggered animations for product information
- Build interactive button animations
- Develop a custom cart animation system

Each step builds upon the previous one, introducing new Reanimated concepts and techniques.

https://github.com/user-attachments/assets/531f75f5-8c9a-4898-b12d-9d82a653b1fa

## Step 1 – Animate the header

<details>
<summary>
  <b>[1]</b> Use Reanimated's CSS transitions to animate the header's opacity and position. When the search bar is focused, the header should fade out and slide up. Use <code>transitionProperty</code> to specify which properties should animate, and <code>transitionDuration</code> and <code>transitionTimingFunction</code> to control the animation timing.
</summary>

<br/>

```jsx
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
  {/* ... */}
>
```

</details>

<br/>

<details>
<summary>
  <b>[2]</b> Implement a smooth width transition for the cancel button using Reanimated's CSS transitions. When the search bar is focused, the button should expand from zero width. Use <code>transitionProperty</code> to animate both width and margin, with <code>transitionDuration</code> and <code>transitionTimingFunction</code> for smooth animation control.
</summary>

<br/>

```jsx
<AnimatedPressable
  {/* ... */}
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
```

</details>

<br/>

<details>
<summary>
  <b>[3]</b> Add a FadeIn entering animation to the counter badge using Reanimated's built-in entering animations. This will create a smooth appearance effect when items are added to the cart.
</summary>

<br/>

```jsx
 <Animated.View style={styles.counter} entering={FadeIn}>
```

</details>

<br/>

## Step 2 - Animate the rating

<details>
<summary>
  <b>[1]</b> Create a staggered animation sequence for the rating stars and score using Reanimated's entering animations. Use <code>FadeInUp</code> with <code>delay</code> and <code>springify</code> for each star, followed by <code>FadeInRight</code> for the rating number to create a sequential reveal effect.
</summary>

<br/>

```jsx
<View style={styles.priceRow}>
  {new Array(5).fill(null).map((_, i) => (
    <Animated.View
      key={i}
      entering={FadeInUp.delay(80 * i + 800)
        .springify()
        .stiffness(100)
        .damping(10)}
    >
      {/* ... */}
    </Animated.View>
  ))}
  <Animated.Text entering={FadeInRight.delay(800)}>4.97</Animated.Text>
</View>
```

</details>

<br/>

## Step 3 - Animate the buy button

<details>
<summary>
  <b>[1]</b> Add a pressed state to the buy button to track when it's being pressed. This state will be used to trigger the button's animation sequence.
</summary>

<br/>

```jsx
function BuyButton({ onPress }: { onPress: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => {
        setPressed(false);
        onPress();
      }}
    >
    {/* ... */}
    </Pressable>
  );
}
```

</details>

<br/>

<details>
<summary>
  <b>[2]</b> Implement a press animation for the buy button using Reanimated's CSS animations. Use <code>animationName</code> to define keyframes for both pressed and released states, with <code>animationDuration</code>, <code>animationTimingFunction</code>, and <code>animationFillMode</code> to control the animation behavior.
</summary>

<br/>

```jsx
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
      {/* ... */}
      <Animated.View/>
```

</details>

<br/>

## Step 4 (final) - Add an animated dot between the button and the cart

<details>
<summary>
  <b>[1]</b> Add a small animated dot to the Tienda component that will create a visual connection between the buy button and the cart. This dot will be animated using Reanimated's shared values and animated styles.
</summary>

<br/>

```jsx
export function Tienda() {
  /* ... */
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/*...*/}
      <Animated.View style={styles.dot} />;
    </View>
  );
}
```

</details>

<br/>

<details>
<summary>
  <b>[2]</b> Set up animated refs for the cart and dot components using <code>useAnimatedRef</code>. These refs will be used to measure component positions and calculate the animation path between them.
</summary>

<details>
<summary>
   Create animated refs in Tienda and pass them to the button and the header
</summary>

<br/>

```jsx
export function Tienda() {
  const cartRef = useAnimatedRef();
  const dotRef = useAnimatedRef();
  /* ... */
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header counter={counter} cartRef={cartRef} />
      {/*...*/}
      <Animated.View ref={dotRef} style={styles.dot} />;
    </View>
  );
}
```

</details>

<br/>

<details>
<summary>
   Pass the cartRef to the cart component
</summary>

<br/>

```jsx
function Header({
  counter,
  cartRef,
}: {
  counter: number;
  cartRef: AnimatedRef<Component>;
}) {
  /* ... */
  return (
    <>
      <Animated.View style={styles.cart} ref={cartRef}>
        {/* ... */}
      </Animated.View>
    </>
  );
}

```

</details>

</details>

<br/>

<details>
<summary>
   <b>[3]</b> Use Reanimated's <code>measure</code> function to calculate the exact offset between the dot and cart positions. Store these values in shared values using <code>useSharedValue</code>.
</summary>

<br/>

```jsx
export function Tienda() {
  const finalOffsetX = useSharedValue(0);
  const finalOffsetY = useSharedValue(0);

  /* ... */

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

  /* ... */
}
```

</details>

<br/>

<details>
<summary>
   <b>[4]</b> Modify the incrementCart function to animate the dot's position using Reanimated's spring animations. Use <code>withSpring</code> and use the callback to reset the position and update the counter.
</summary>

<br/>

```jsx
export function Tienda() {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  /* ... */

  const incrementBasket = () => {
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

  /* ... */
}
```

</details>

<br/>

<details>
<summary>
   <b>[5]</b> Create an animated style for the dot using <code>useAnimatedStyle</code> that combines translation and opacity interpolation. Use <code>interpolate</code> to create a smooth fade-out effect as the dot moves along its path.
</summary>

<br/>

```jsx
export function Tienda() {
  /* ... */

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

  /* ... */
  return (
    <View /*...*/>
      {/*...*/}
      <Animated.View ref={dotRef} style={[styles.dot, dotAnimatedStyle]} />;
    </View>
  );
}
```

</details>

<br/>

# Part 2 - The 3D Preview

In this section, we'll implement a 3D product preview using React Native WGPU and Three.js. You'll learn how to:

- Set up a WebGPU rendering pipeline in React Native
- Work with Three.js scene graphs and cameras
- Implement loading states and transitions
- Create dynamic lighting and camera animations
- Handle 3D model loading and positioning

Each step introduces new concepts in 3D graphics programming and demonstrates how to integrate them with React Native.

## Step 1 - Create a placeholder for the 3D preview

https://github.com/user-attachments/assets/88f49b52-98ca-4e93-a239-d54b80e21deb

In this step, we'll create a loading placeholder that provides visual feedback while the 3D model loads. We'll implement a shimmer effect using Reanimated's CSS animations to create a smooth, professional loading state.

<details>
<summary>
  <b>[1]</b> Implement a shimmer loading effect using Reanimated's CSS animations. The effect is created by animating a gradient overlay that moves across the skeleton placeholder. The gradient is wider than the container (300%) and positioned with negative margins to create a seamless loop. Use <code>animationName</code> with keyframes to define the movement, and set <code>animationIterationCount</code> to "infinite" for continuous animation. The gradient's background uses a linear gradient with three color stops to create the shimmer effect. It's defined in <code>styles.gradient</code>.
</summary>

```jsx
function Loading() {
  return (
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
  );
}
```

The shimmer effect works by:

1. Creating a container with a light background color
2. Adding a wider gradient overlay that moves across the container
3. Using three color stops in the gradient (46%, 50%, 54%) to create a smooth transition
4. Animating the gradient's position using CSS transforms
5. Setting up a continuous animation loop that translates it back and forth

</details>

<br/>

<details>
<summary>
  <b>[2]</b> Add a FadeOut exiting animation to the loading placeholder using Reanimated's built-in exiting animations. This ensures a smooth transition when the 3D model is ready to be displayed.
</summary>

```jsx
function Loading() {
  return (
    <View style={styles.skeleton}>
      <Animated.View
        exiting={FadeOut}
        /* ... */
      />
    </View>
  );
}
```

</details>

<br/>

## Step 2 - Add the 3D model

https://github.com/user-attachments/assets/e097fe9b-18fd-4c2b-b442-31e96638b91f

</details>

<br/>

<details>
<summary>
  <b>[1]</b> Set up the WebGPU rendering pipeline by creating a Canvas component and connecting it to the GPU context. Use the <code>useGPUContext</code> hook to get access to the WebGPU context and ref, which will be used to create the Three.js renderer. The Canvas component should be transparent to allow for proper blending with the background.
</summary>

```jsx
export function Preview() {
  const [ready, setReady] = useState(false);

  const { ref, context } = useGPUContext();

  return (
    <View style={{ flex: 0.75, justifyContent: "center" }}>
      {!ready && <Loading />}
      <Canvas
        ref={ref}
        transparent={true}
        style={{ flex: 1, maxHeight: 450 }}
      />
    </View>
  );
}
```

</details>

<br/>

<details>
<summary>
  <b>[2]</b> Load the 3D model using the <code>useGLTF</code> hook, which handles the asynchronous loading of the GLTF file and its associated textures. The model will be used to create a Three.js scene graph that can be manipulated and rendered.
</summary>

```jsx
export function Preview() {
  const gltf = useGLTF(require("./assets/shoe/shoe.gltf"));
  const [ready, setReady] = useState(false);
  const { ref, context } = useGPUContext();

  return (
    <View style={{ flex: 0.75, justifyContent: "center" }}>
      {!ready && <Loading />}
      <Canvas
        ref={ref}
        transparent={true}
        style={{ flex: 1, maxHeight: 450 }}
      />
    </View>
  );
}
```

</details>

<br/>

<details>
<summary>
  <b>[3]</b> Set up the Three.js scene hierarchy by creating a <code>THREE.Scene</code> container and a <code>THREE.PerspectiveCamera</code>. The camera is configured with a narrow field of view (10 degrees) for a detailed product view, and proper near/far clipping planes (0.25/10) to ensure the model is visible. Create a WebGPU renderer using <code>makeWebGPURenderer</code> which bridges Three.js with the GPU context. Set up a continuous animation loop using <code>setAnimationLoop</code> to render the scene graph and present it to the GPU context. The renderer handles the conversion of Three.js scene data into GPU commands, including geometry, materials, and lighting calculations.
</summary>

```jsx
export function Preview() {
/* ... */

  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();

    camera.position.set(0, 0.2, 2);

    const renderer = makeWebGPURenderer(context);

    function animate() {
      camera.lookAt(new THREE.Vector3(0, 0, 0));
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

/* ... */
}
```

</details>

<br/>

<details>
<summary>
  <b>[4]</b> Add the loaded 3D model to the scene graph. Position the model slightly below the center point to create a more natural viewing angle. The model's position is adjusted using Three.js's <code>THREE.Vector3</code> coordinate system, where the Y-axis is used to move elements up and down.
</summary>

```diff
export function Preview() {
/* ... */
  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();

    camera.position.set(0, 0.2, 2);
+    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);

+    scene.add(gltf.scene);

    function animate() {
      camera.lookAt(new THREE.Vector3(0, 0, 0));
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

/* ... */
}
```

</details>

<br/>

<details>
<summary>
  <b>[5]</b> Set up scene lighting by adding a directional light source (<code>THREE.DirectionalLight</code>). The directional light simulates sunlight, providing consistent illumination across the model. Position the light above the model, and set its target to the scene's center point to ensure proper shadow casting.
</summary>

```diff
export function Preview() {
/* ... */
  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();
+    const light = new THREE.DirectionalLight(0xffffff, 3);

    camera.position.set(0, 0.2, 2);
+    light.position.set(0, 0.1, 1);
+    light.target.position.set(0, 0, 0);
    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);

+    scene.add(light);
    scene.add(gltf.scene);

    function animate() {
      camera.lookAt(new THREE.Vector3(0, 0, 0));
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

/* ... */
}
```

</details>

<br/>

<details>
<summary>
  <b>[6]</b> Create a smooth camera animation using Three.js's <code>THREE.Clock</code> utility. The camera moves in a circular path around the model using trigonometric functions, creating a natural product showcase effect. The camera always looks at the center point to maintain focus on the model.
</summary>

```diff
export function Preview() {
/* ... */
  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);

    camera.position.set(0, 0.2, 2);
    light.position.set(0, 0.1, 1);
    light.target.position.set(0, 0, 0);
    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);

    scene.add(light);
    scene.add(gltf.scene);

+    function animateCamera() {
+      const distance = 2;
+      const elapsed = clock.getElapsedTime();
+
+      camera.position.x = Math.sin(elapsed) * distance;
+      camera.position.z = Math.cos(elapsed) * distance;
+      camera.lookAt(new THREE.Vector3(0, 0, 0));
+    }

    function animate() {
+      animateCamera();
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

/* ... */
}
```

</details>

<br/>

<details>
<summary>
  <b>[7]</b> Synchronize the directional light's position with the camera movement to create dynamic lighting that follows the viewer's perspective. This creates a more immersive experience as the shadows and highlights on the model change naturally with the camera's position.
</summary>

```diff
export function Preview() {
/* ... */
  useEffect(() => {
    if (!gltf || !context) {
      return;
    }

    const { width, height } = context.canvas;
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(10, width / height, 0.25, 10);
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 3);

    camera.position.set(0, 0.2, 2);
    light.position.set(0, 0.1, 1);
    light.target.position.set(0, 0, 0);
    gltf.scene.position.set(0, -0.1, 0);

    const renderer = makeWebGPURenderer(context);

    scene.add(light);
    scene.add(gltf.scene);

    function animateCamera() {
      const distance = 2;
      const elapsed = clock.getElapsedTime();

      camera.position.x = Math.sin(elapsed) * distance;
      camera.position.z = Math.cos(elapsed) * distance;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

+      light.position.x = camera.position.x;
+      light.position.z = camera.position.z;
+      light.target.position.set(0, 0, 0);
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

/* ... */
}
```

</details>

<br/>
