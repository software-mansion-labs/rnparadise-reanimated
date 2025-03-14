# React Native Paradise - Day 4

A comprehensive workshop series on React Native animations and interactions, featuring hands-on exercises with Reanimated, Gesture Handler, Skia, and WebGPU.

## Hosted by

- Bartłomiej Błoniarz ([@BBloniarz\_](https://x.com/BBloniarz_))

## About the Workshop

This workshop is part of the React Native Paradise Workshops, bringing together the best practices and latest features in React Native animations and interactions. The workshop materials are based on the work by Catalin Miron ([@mironcatalin](https://x.com/mironcatalin)) and Kacper Kapuściak ([@kacperkapusciak](https://x.com/kacperkapusciak)).

## Setup

This workshop uses React Native with Expo development build. You'll need to set up your development environment for both iOS and Android platforms.

Alternatively, you can use [Radon IDE](https://ide.swmansion.com/) - a VS Code and Cursor extension for React Native development.

## Preparing device

To set up a local development environment for running your project on Android and iOS, follow [this guide](https://docs.expo.dev/get-started/set-up-your-environment/).

## Running the app

After completing _Preparing device_ installation step, you now should be able to clone this repo and launch the app.
Follow the below steps from the terminal:

1. Clone the repo:

```bash
git clone git@github.com:software-mansion-labs/rnparadise-reanimated.git && cd rnparadise-reanimated
```

2. Install project dependencies (run the below command from the project main directory):

```bash
yarn install
```

3. Create development builds for iOS and Android:

```bash
npx expo prebuild
```

4. Launch the app:

For iOS:

```bash
npx expo run:ios
```

For Android:

```bash
npx expo run:android
```

## Tools and libraries

During the workshop we will be using primarily:

- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Skia](https://shopify.github.io/react-native-skia/)
- [React Native WebGPU](https://github.com/wcandillon/react-native-webgpu)

## Next step

**Go to: [Circle Gestures](./src/lessons/1_CircleGestures/)**
