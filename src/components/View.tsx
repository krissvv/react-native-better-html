import { memo, useMemo } from "react";
import {
   GestureResponderEvent,
   View as NativeView,
   ViewProps as NativeViewProps,
   ViewStyle as NativeViewStyle,
   Platform,
   TouchableHighlight,
   TouchableNativeFeedback,
   TouchableOpacity,
} from "react-native";
import { OmitProps, useTheme } from "react-better-core";

import { ComponentStyle } from "../types/components";

const touchableHighlightStyleMoveToContent: (keyof ComponentStyle)[] = [
   "width",
   "backgroundColor",
   "padding",
   "paddingTop",
   "paddingBottom",
   "paddingLeft",
   "paddingRight",
   "paddingHorizontal",
   "paddingVertical",
   "borderWidth",
   "borderTopWidth",
   "borderBottomWidth",
   "borderLeftWidth",
   "borderRightWidth",
   "borderColor",
   "borderTopColor",
   "borderBottomColor",
   "borderLeftColor",
   "borderRightColor",
];

const touchableNativeFeedbackStyleMoveToHolder: (keyof ComponentStyle)[] = [
   "width",
   "height",
   "margin",
   "marginTop",
   "marginBottom",
   "marginLeft",
   "marginRight",
   "marginHorizontal",
   "marginVertical",
];

function alphaToHex(alpha: number): string {
   const clamped = Math.min(1, Math.max(0, alpha));
   const value = Math.round(clamped * 255);

   return value.toString(16).padStart(2, "0");
}

export type ViewProps<Value = unknown> = {
   /** @default false */
   isRow?: boolean;
   value?: Value;
   /** @default false */
   disabled?: boolean;
   /** @default "highlight" */
   pressType?: "opacity" | "highlight";
   /** @default 0.8 */
   pressStrength?: number;
   onPress?: (event: GestureResponderEvent) => void;
   onPressIn?: (event: GestureResponderEvent) => void;
   onPressOut?: (event: GestureResponderEvent) => void;
   onLongPress?: (event: GestureResponderEvent) => void;
   onPressWithValue?: (value: Value) => void;
} & OmitProps<NativeViewProps, "style" | "onBlur" | "onFocus"> &
   ComponentStyle;

type ViewComponentType = {
   <Value>(props: ViewProps<Value>): React.ReactElement;
   box: <Value>(
      props: ViewProps<Value> & {
         /** @default false */
         withShadow?: boolean;
      },
   ) => React.ReactElement;
};

const ViewComponent: ViewComponentType = function View<Value>({
   isRow,
   value,
   disabled,
   pressType = "highlight",
   pressStrength = 0.8,
   onPress,
   onPressIn,
   onPressOut,
   onLongPress,
   onPressWithValue,
   children,
   ...props
}: ViewProps<Value>) {
   const theme = useTheme();

   const style = useMemo<NativeViewStyle>(
      () => ({
         flexDirection: isRow ? "row" : "column",
         ...props,
         ...(props.shadowOffsetWidth !== undefined || props.shadowOffsetHeight !== undefined
            ? {
                 shadowOffset: {
                    width: props.shadowOffsetWidth ?? 0,
                    height: props.shadowOffsetHeight ?? 0,
                 },
              }
            : {}),
      }),
      [isRow, props],
   );
   const touchableHighlightStyle = useMemo<NativeViewStyle>(
      () => ({
         ...style,
         ...touchableHighlightStyleMoveToContent.reduce<NativeViewStyle>((previousValue, currentValue) => {
            if (currentValue === "shadowOffsetWidth" || currentValue === "shadowOffsetHeight")
               previousValue.shadowOffset = undefined;
            else previousValue[currentValue] = undefined;

            return previousValue;
         }, {}),
         width: props.width !== "100%" ? props.width : undefined,
      }),
      [style],
   );
   const touchableHighlightContentProps = useMemo<ViewProps>(
      () =>
         touchableHighlightStyleMoveToContent.reduce<ViewProps>((previousValue, currentValue) => {
            (previousValue[currentValue] as any) = props[currentValue];

            return previousValue;
         }, {}),
      [props],
   );
   const touchableNativeFeedbackHolderStyle = useMemo<NativeViewStyle>(
      () =>
         touchableNativeFeedbackStyleMoveToHolder.reduce<ViewProps>((previousValue, currentValue) => {
            (previousValue[currentValue] as any) = props[currentValue];

            return previousValue;
         }, {}),
      [props],
   );
   const touchableNativeFeedbackContentStyle = useMemo<ViewProps>(
      () => ({
         ...style,
         ...touchableNativeFeedbackStyleMoveToHolder.reduce<NativeViewStyle>(
            (previousValue, currentValue) => {
               if (currentValue === "shadowOffsetWidth" || currentValue === "shadowOffsetHeight")
                  previousValue.shadowOffset = undefined;
               else previousValue[currentValue] = undefined;

               return previousValue;
            },
            {},
         ),
      }),
      [style],
   );

   const pressEvents = useMemo(
      () =>
         !disabled
            ? {
                 onPress: (event: GestureResponderEvent) => {
                    onPress?.(event);

                    if (value !== undefined) onPressWithValue?.(value);
                 },
                 onPressIn,
                 onPressOut,
                 onLongPress,
              }
            : {},
      [disabled, onPress, onPressIn, onPressOut, onLongPress, onPressWithValue, value],
   );

   const androidBoxShadow =
      Platform.OS === "android"
         ? props.shadowOffsetWidth !== undefined || props.shadowOffsetHeight !== undefined
            ? `${props.shadowOffsetWidth ?? 0}px ${props.shadowOffsetHeight ?? 0}px ${props.shadowRadius}px ${
                 props.shadowColor?.toString() ?? "#000000"
              }`
            : undefined
         : undefined;

   const isPressable = onPress || onPressIn || onPressOut || onLongPress || onPressWithValue;

   return isPressable ? (
      pressType === "opacity" ? (
         <TouchableOpacity
            style={style}
            activeOpacity={pressStrength}
            boxShadow={androidBoxShadow}
            {...pressEvents}
            {...props}
         >
            {children}
         </TouchableOpacity>
      ) : pressType === "highlight" ? (
         Platform.OS === "ios" ? (
            <TouchableHighlight
               activeOpacity={pressStrength}
               underlayColor={theme.colors.textPrimary}
               style={touchableHighlightStyle}
               {...pressEvents}
               {...props}
            >
               <ViewComponent
                  width="100%"
                  height={props.height}
                  borderRadius={props.borderRadius}
                  borderTopLeftRadius={props.borderTopLeftRadius}
                  borderTopRightRadius={props.borderTopRightRadius}
                  borderBottomLeftRadius={props.borderBottomLeftRadius}
                  borderBottomRightRadius={props.borderBottomRightRadius}
                  {...touchableHighlightContentProps}
               >
                  {children}
               </ViewComponent>
            </TouchableHighlight>
         ) : Platform.OS === "android" ? (
            <ViewComponent
               {...touchableNativeFeedbackHolderStyle}
               borderRadius={props.borderRadius}
               borderTopLeftRadius={props.borderTopLeftRadius}
               borderTopRightRadius={props.borderTopRightRadius}
               borderBottomLeftRadius={props.borderBottomLeftRadius}
               borderBottomRightRadius={props.borderBottomRightRadius}
               boxShadow={androidBoxShadow}
               overflow="hidden"
               pointerEvents="box-none"
            >
               <TouchableNativeFeedback
                  {...pressEvents}
                  {...props}
                  background={TouchableNativeFeedback.Ripple(
                     `${theme.colors.textPrimary}${alphaToHex(1 - pressStrength)}`,
                     false,
                  )}
                  useForeground
                  touchSoundDisabled
               >
                  <ViewComponent flex={1} {...touchableNativeFeedbackContentStyle}>
                     {children}
                  </ViewComponent>
               </TouchableNativeFeedback>
            </ViewComponent>
         ) : (
            <></>
         )
      ) : (
         <></>
      )
   ) : (
      <NativeView boxShadow={androidBoxShadow} style={style} {...props}>
         {children}
      </NativeView>
   );
};

ViewComponent.box = function Box({ withShadow, ...props }) {
   const theme = useTheme();

   const shadowProps = useMemo<ViewProps>(
      () =>
         withShadow
            ? {
                 shadowOpacity: 0.2,
                 shadowOffsetHeight: 10,
                 shadowRadius: 10,
                 shadowColor: Platform.OS === "android" ? "#00000020" : undefined,
              }
            : {},
      [],
   );

   return (
      <ViewComponent
         width="100%"
         backgroundColor={theme.colors.backgroundContent}
         borderWidth={1}
         borderColor={theme.colors.border}
         borderRadius={theme.styles.borderRadius}
         paddingHorizontal={theme.styles.space}
         paddingVertical={theme.styles.gap}
         {...(shadowProps as any)}
         {...props}
      />
   );
} as ViewComponentType["box"];

const View = memo(ViewComponent) as any as typeof ViewComponent & {
   box: typeof ViewComponent.box;
};

View.box = ViewComponent.box;

export default View;
