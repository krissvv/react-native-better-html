# react-native-better-components

A component library for react native that is as close to plane react-native as possible

![NPM Version](https://img.shields.io/npm/v/react-native-better-html-components)
![GitHub Repo stars](https://img.shields.io/github/stars/krissvv/react-native-better-components?style=flat)
![GitHub package.json version](https://img.shields.io/github/package-json/v/krissvv/react-native-better-components)
![NPM Type Definitions](https://img.shields.io/npm/types/react-native-better-html-components)<br/>
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/krissvv/react-native-better-components/document-deploy.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/krissvv/react-native-better-components)
![NPM Downloads](https://img.shields.io/npm/dm/react-native-better-html-components)<br/>
![NPM License](https://img.shields.io/npm/l/react-native-better-html-components)<br/>
![React dep](https://img.shields.io/badge/React-v19-9b6499)

# 🚧 Work in progress 🚧

🔴 The library is not yet ready for use - development is actively in progress 🔴

## Documentation

You can find the full documentation on the home page of the official [Docs](https://krissvv.github.io/react-native-better-components) website.

## Requirements

-  [React](https://react.dev) version 19.0 or above.
-  [React Native](https://reactnative.dev) version 0.82 or above.

## Installation

To install `react-native-better-components` run the following command in your project directory:

```bash
npm install react-native-better-components
```

## Configuration

The `<BetterComponentsProvider>` component should wrap your application's root component to apply the configuration.

```jsx
import { Stack } from "expo-router";
import { BetterComponentsProvider } from "react-native-better-components";

export default function RootLayout() {
   return (
      <BetterComponentsProvider>
         <Stack />
      </BetterComponentsProvider>
   );
}
```

This is enough for the components to work with the default configurations that the library comes with. They can be overridden when passing `config` prop to the `<BetterComponentsProvider>` tag.

## Problems?

Ask for help on [Stack Overflow](https://stackoverflow.com/questions/ask), on our [GitHub repository](https://github.com/krissvv/react-native-better-components/issues/new) or contact the contributors.
