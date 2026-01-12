import { memo, useCallback } from "react";
import { ColorValue, GestureResponderEvent, Platform } from "react-native";
import {
   AnyOtherString,
   AssetName,
   IconName,
   LoaderName,
   OmitProps,
   useLoader,
   useTheme,
} from "react-better-core";

import { pressStrength } from "../utils/variableFunctions";

import View, { ViewProps } from "./View";
import Text, { TextProps } from "./Text";
import Animate from "./Animate";
import Loader from "./Loader";
import Image from "./Image";
import Icon, { IconNameIOS } from "./Icon";

export type ButtonProps<Value> = {
   text?: string;
   /** @default 16 */
   textFontSize?: TextProps["fontSize"];
   /** @default 700 */
   textFontWeight?: TextProps["fontWeight"];
   textDecorationLine?: TextProps["textDecorationLine"];
   /** @default "base" */
   textColor?: ColorValue;

   icon?: IconName | AnyOtherString;
   iconIOS?: IconNameIOS;
   /** @default "left" */
   iconPosition?: "left" | "right";
   /** @default Same as text color */
   iconColor?: string;
   /** @default 16 */
   iconSize?: number;

   image?: AssetName | AnyOtherString;
   /** @default "left" */
   imagePosition?: "left" | "right";
   /** @default 16 */
   imageWidth?: number;
   /** @default undefined */
   imageHeight?: number;

   loaderName?: LoaderName | AnyOtherString;
   /** @default false */
   isLoading?: boolean;

   isSmall?: true | "left" | "center" | "right";
} & ViewProps<Value>;

type InternalButtonProps<Value> = ButtonProps<Value> & {
   animateOpacity?: number;
};

export type ButtonRef = {};

type ButtonComponentType = {
   <Value>(props: ButtonProps<Value>): React.ReactElement;
   secondary: <Value>(props: ButtonProps<Value>) => React.ReactElement;
   destructive: <Value>(props: ButtonProps<Value>) => React.ReactElement;
   text: <Value>(props: ButtonProps<Value>) => React.ReactElement;
   icon: <Value>(
      props: OmitProps<ButtonProps<Value>, "width" | "height" | "isSmall"> & {
         /** @default 16 */
         size?: number;
      },
   ) => React.ReactElement;
};

const ButtonComponent = function Button<Value>({
   value,
   text,
   textFontSize = 16,
   textFontWeight = 700,
   textDecorationLine,
   textColor,

   icon,
   iconIOS,
   iconPosition = "left",
   iconColor,
   iconSize,

   image,
   imagePosition = "left",
   imageWidth,
   imageHeight,

   loaderName,
   isLoading,

   isSmall,

   animateOpacity,

   flex,
   alignSelf,
   disabled,

   onPress,
   onPressWithValue,
   ...props
}: InternalButtonProps<Value>) {
   const theme = useTheme();
   const isLoadingLoader = useLoader(loaderName);

   const isLoadingElement = isLoading || isLoadingLoader;
   const isDisabled = disabled || isLoadingElement;

   const lineHeight = 20;
   const color = textColor ?? theme.colors.base;
   const paddingVertical = props.paddingVertical
      ? parseFloat(props.paddingVertical.toString())
      : theme.styles.space;
   const paddingHorizontal = props.paddingHorizontal
      ? parseFloat(props.paddingHorizontal.toString())
      : theme.styles.space + theme.styles.gap;

   const buttonHeight = paddingVertical + lineHeight + paddingVertical;

   const onPressElement = useCallback(
      (event: GestureResponderEvent) => {
         onPress?.(event);
         onPressWithValue?.(value as any);
      },
      [onPress, onPressWithValue, value],
   );

   const iconComponent = icon ? (
      <View height={20} alignItems="center" justifyContent="center">
         <Icon
            name={icon}
            nameIOS={iconIOS}
            color={iconColor ?? textColor ?? theme.colors.base}
            size={iconSize ?? textFontSize ?? 16}
         />
      </View>
   ) : undefined;
   const imageComponent = image ? (
      <Image name={image} width={imageWidth ?? textFontSize ?? 16} height={imageHeight} />
   ) : undefined;

   return (
      <Animate.View
         position="relative"
         flex={flex}
         alignSelf={
            alignSelf ??
            (isSmall === "left"
               ? "flex-start"
               : isSmall === "right"
               ? "flex-end"
               : isSmall === "center"
               ? "center"
               : isSmall
               ? "baseline"
               : undefined)
         }
         initialOpacity={1}
         animateOpacity={animateOpacity ?? (disabled ? 0.6 : 1)}
      >
         <View
            position="relative"
            width={!isSmall ? "100%" : undefined}
            height={Platform.OS === "android" ? buttonHeight : undefined}
            alignItems="center"
            justifyContent="center"
            backgroundColor={theme.colors.primary}
            borderRadius={theme.styles.borderRadius}
            paddingVertical={paddingVertical}
            paddingHorizontal={paddingHorizontal}
            disabled={isDisabled}
            onPress={onPressElement}
            {...props}
         >
            <Animate.View initialOpacity={1} animateOpacity={isLoadingElement ? 0 : 1}>
               <View isRow alignItems="center" justifyContent="center" gap={theme.styles.gap}>
                  {iconPosition === "left" && iconComponent}
                  {imagePosition === "left" && imageComponent}

                  {text && (
                     <Text
                        fontSize={textFontSize}
                        fontWeight={textFontWeight}
                        textDecorationLine={textDecorationLine}
                        textDecorationColor={color}
                        textAlign="center"
                        lineHeight={lineHeight}
                        color={color}
                     >
                        {text}
                     </Text>
                  )}

                  {iconPosition === "right" && iconComponent}
                  {imagePosition === "right" && imageComponent}
               </View>
            </Animate.View>

            <Animate.View
               position="absolute"
               width="100%"
               height={buttonHeight}
               left={paddingHorizontal}
               alignItems="center"
               justifyContent="center"
               initialOpacity={0}
               animateOpacity={isLoadingElement ? 1 : 0}
            >
               <Loader color={color} />
            </Animate.View>
         </View>
      </Animate.View>
   );
};

ButtonComponent.secondary = function Secondary(props) {
   const theme = useTheme();

   return (
      <ButtonComponent
         backgroundColor={theme.colors.backgroundContent}
         borderWidth={1}
         borderColor={theme.colors.border}
         textColor={theme.colors.textPrimary}
         pressStrength={pressStrength().p05}
         animateOpacity={props.disabled ? 0.4 : 1}
         {...props}
      />
   );
} as ButtonComponentType[`secondary`];

ButtonComponent.destructive = function Destructive(props) {
   const theme = useTheme();

   return <ButtonComponent backgroundColor={theme.colors.error} {...props} />;
} as ButtonComponentType[`destructive`];

ButtonComponent.text = function ButtonText(props) {
   const theme = useTheme();

   return (
      <ButtonComponent
         width="auto"
         textFontWeight={400}
         textColor={theme.colors.textPrimary}
         textDecorationLine="underline"
         backgroundColor="transparent"
         paddingHorizontal={theme.styles.space}
         paddingVertical={theme.styles.gap}
         isSmall
         pressType="opacity"
         {...props}
      />
   );
} as ButtonComponentType[`text`];

ButtonComponent.icon = function ButtonIcon({ size = 16, ...props }) {
   const theme = useTheme();

   const buttonSize = size + theme.styles.space;

   return (
      <ButtonComponent
         width={buttonSize}
         height={buttonSize}
         textColor={theme.colors.textPrimary}
         backgroundColor="transparent"
         hitSlop={theme.styles.gap / 2}
         borderRadius={999}
         iconSize={size}
         paddingVertical={0}
         paddingHorizontal={0}
         pressType="opacity"
         {...props}
      />
   );
} as ButtonComponentType[`icon`];

const Button = memo(ButtonComponent) as any as ButtonComponentType & {
   secondary: typeof ButtonComponent.secondary;
   destructive: typeof ButtonComponent.destructive;
   text: typeof ButtonComponent.text;
   icon: typeof ButtonComponent.icon;
};

Button.secondary = ButtonComponent.secondary;
Button.destructive = ButtonComponent.destructive;
Button.text = ButtonComponent.text;
Button.icon = ButtonComponent.icon;

export default Button;
