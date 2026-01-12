export {
   useTheme,
   useLoader,
   useLoaderControls,
   countries,
   type OmitProps,
   type ExcludeOptions,
   type PickValue,
   type PartialRecord,
   type DeepPartialRecord,
   type PickAllRequired,
   type AnyOtherString,
   type AssetName,
   type AssetsConfig,
   type Country,
   type IconName,
   type IconsConfig,
   type LoaderName,
   type LoaderConfig,
   type Color,
   type ColorName,
   type ColorTheme,
   type Colors,
   type Styles,
   type Theme,
   type ThemeConfig,
   lightenColor,
   darkenColor,
   saturateColor,
   desaturateColor,
   generateRandomString,
   formatPhoneNumber,
   eventPreventDefault,
   eventStopPropagation,
   eventPreventStop,
   getPluralWord,
   useBooleanState,
   useDebounceState,
   loaderControls,
   colorThemeControls,
} from "react-better-core";

import BetterComponentsProvider, {
   useBetterComponentsContext,
   useAlertControls,
   type BetterComponentsProviderConfig,
} from "./components/BetterComponentsProvider";

import { type AppConfig, type BetterComponentsConfig } from "./types/config";
import { type ComponentMarginProps, type ComponentPaddingProps } from "./types/components";
import { type PluginName, type BetterComponentsPlugin } from "./types/plugin";

import { alertControls, pressStrength } from "./utils/variableFunctions";

import { useDevice, useKeyboard, useForm, useEventEmitter } from "./utils/hooks";
import { getFormErrorObject } from "./utils/functions";
import { generateAsyncStorage } from "./utils/asyncStorage";

import View, { type ViewProps } from "./components/View";
import Text, { type TextProps } from "./components/Text";
import Button, { type ButtonProps } from "./components/Button";
import Loader, { type LoaderProps, type LoaderSize } from "./components/Loader";
import Animate, { type AnimateViewProps, type AnimateTextProps } from "./components/Animate";
import ScreenHolder, { type ScreenHolderProps, type FooterProps } from "./components/ScreenHolder";
import Image, { type ImageProps } from "./components/Image";
import Icon, { type IconProps, type IconNameIOS } from "./components/Icon";
import InputField, { type InputFieldProps, type InputFieldRef } from "./components/InputField";
import Switch, { type SwitchProps } from "./components/Switch";
import StatusBar, { type StatusBarProps } from "./components/StatusBar";
import ListItem, { type ListItemProps } from "./components/ListItem";

export * from "./plugins";

export {
   BetterComponentsProvider,
   useBetterComponentsContext as useBetterComponentsContext,
   useAlertControls,
   BetterComponentsProviderConfig,

   // Constants

   // Types
   AppConfig,
   BetterComponentsConfig as BetterComponentsConfig,
   ComponentMarginProps,
   ComponentPaddingProps,
   PluginName,
   BetterComponentsPlugin,

   // Hooks
   useDevice,
   useKeyboard,
   useForm,
   useEventEmitter,

   // Functions
   getFormErrorObject,

   // Variable Functions
   alertControls,
   pressStrength,

   // AsyncStorage
   generateAsyncStorage,

   // Components
   View,
   ViewProps,
   Text,
   TextProps,
   Button,
   ButtonProps,
   Loader,
   LoaderProps,
   LoaderSize,
   Animate,
   AnimateViewProps,
   AnimateTextProps,
   ScreenHolder,
   ScreenHolderProps,
   FooterProps,
   Image,
   ImageProps,
   Icon,
   IconProps,
   IconNameIOS,
   InputField,
   InputFieldProps,
   InputFieldRef,
   Switch,
   SwitchProps,
   StatusBar,
   StatusBarProps,
   ListItem,
   ListItemProps,
};
