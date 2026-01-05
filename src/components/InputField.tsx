import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FocusEvent, TextInput, TextStyle } from "react-native";
import {
   darkenColor,
   lightenColor,
   useBetterCoreContext,
   useBooleanState,
   useTheme,
} from "react-better-core";

import { ComponentPropWithRef } from "../types/components";

import View from "./View";
import Text from "./Text";
import Animate from "./Animate";

export type InputFieldProps = {
   placeholder?: string;
   prefix?: string;
   suffix?: string;
   defaultValue?: string;
   value?: string | number;
   /** @default true */
   editable?: boolean;
   /** @default false */
   autoFocus?: boolean;
   autoCapitalize?: React.ComponentProps<typeof TextInput>["autoCapitalize"];
   autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
   autoCorrect?: React.ComponentProps<typeof TextInput>["autoCorrect"];
   /** @default "default" */
   keyboardAppearance?: React.ComponentProps<typeof TextInput>["keyboardAppearance"];
   keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
   /** @default false */
   secureTextEntry?: boolean;
   onFocus?: (event: FocusEvent) => void;
   onBlur?: (event: FocusEvent) => void;
   onChange?: (text: string) => void;
};

export type InputFieldRef = {};

type InputFieldComponentType = {
   (props: ComponentPropWithRef<InputFieldRef, InputFieldProps>): React.ReactElement;
   email: (props: ComponentPropWithRef<InputFieldRef, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<InputFieldRef, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef<InputFieldRef, InputFieldProps>(
   (
      {
         placeholder,
         prefix,
         suffix,
         defaultValue,
         value,
         editable = true,
         autoFocus,
         autoCapitalize,
         autoComplete,
         autoCorrect,
         keyboardAppearance = "default",
         keyboardType,
         secureTextEntry,
         onFocus,
         onBlur,
         onChange,
      },
      ref,
   ) => {
      const theme = useTheme();
      const { colorTheme } = useBetterCoreContext();

      const [internalValue, setInternalValue] = useState(value?.toString() || defaultValue || "");
      const [isFocused, setIsFocused] = useBooleanState();

      const borderWidth = 1;
      const lineHeight = 20;
      const paddingHorizontal = theme.styles.space;
      const paddingVertical = (theme.styles.space + theme.styles.gap) / 2;
      const height = borderWidth + paddingVertical + lineHeight + paddingVertical + borderWidth;

      const onFocusElement = useCallback((event: FocusEvent) => {
         setIsFocused.setTrue();
         onFocus?.(event);
      }, []);
      const onBlurElement = useCallback((event: FocusEvent) => {
         setIsFocused.setFalse();
         onBlur?.(event);
      }, []);
      const onChangeText = useCallback(
         (text: string) => {
            setInternalValue(text);
            onChange?.(text);
         },
         [onChange],
      );

      const textInputStyle = useMemo<TextStyle>(
         () => ({
            flex: 1,
            fontSize: 16,
            lineHeight,
            color: theme.colors.textPrimary,
            paddingHorizontal,
            paddingVertical,
         }),
         [theme.colors, lineHeight, paddingHorizontal, paddingVertical],
      );

      useEffect(() => {
         if (value === undefined) return;

         setInternalValue(value.toString());
      }, [value]);

      useImperativeHandle(
         ref,
         (): InputFieldRef => {
            return {};
         },
         [],
      );

      const prefixSuffixBackgroundColor =
         colorTheme === "light"
            ? darkenColor(theme.colors.backgroundContent, 0.03)
            : lightenColor(theme.colors.backgroundContent, 0.1);

      return (
         <View isRow position="relative" alignItems="center" height={height}>
            {prefix && (
               <View
                  isRow
                  height="100%"
                  backgroundColor={prefixSuffixBackgroundColor}
                  alignItems="center"
                  borderWidth={borderWidth}
                  borderRightWidth={0}
                  borderTopLeftRadius={theme.styles.borderRadius}
                  borderBottomLeftRadius={theme.styles.borderRadius}
                  borderColor={theme.colors.border}
                  paddingHorizontal={paddingHorizontal}
               >
                  <Text fontWeight={700}>{prefix}</Text>
               </View>
            )}

            <Animate.View
               flex={1}
               backgroundColor={theme.colors.backgroundContent}
               borderTopLeftRadius={prefix ? 0 : theme.styles.borderRadius}
               borderBottomLeftRadius={prefix ? 0 : theme.styles.borderRadius}
               borderTopRightRadius={suffix ? 0 : theme.styles.borderRadius}
               borderBottomRightRadius={suffix ? 0 : theme.styles.borderRadius}
               borderWidth={borderWidth}
               initialBorderColor={theme.colors.border}
               animateBorderColor={isFocused ? theme.colors.primary : theme.colors.border}
               overflow="hidden"
            >
               <TextInput
                  style={textInputStyle}
                  value={internalValue}
                  defaultValue={defaultValue}
                  autoCapitalize={autoCapitalize}
                  autoComplete={autoComplete}
                  autoCorrect={autoCorrect}
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  placeholderTextColor={theme.colors.textSecondary + "80"}
                  readOnly={!editable}
                  keyboardAppearance={keyboardAppearance}
                  keyboardType={keyboardType}
                  cursorColor={theme.colors.primary}
                  selectionColor={theme.colors.primary}
                  secureTextEntry={secureTextEntry}
                  onFocus={onFocusElement}
                  onBlur={onBlurElement}
                  onChangeText={onChangeText}
               />
            </Animate.View>

            {suffix && (
               <View
                  isRow
                  height="100%"
                  backgroundColor={prefixSuffixBackgroundColor}
                  alignItems="center"
                  borderWidth={borderWidth}
                  borderLeftWidth={0}
                  borderTopRightRadius={theme.styles.borderRadius}
                  borderBottomRightRadius={theme.styles.borderRadius}
                  borderColor={theme.colors.border}
                  paddingHorizontal={paddingHorizontal}
               >
                  <Text fontWeight={700}>{suffix}</Text>
               </View>
            )}
         </View>
      );
   },
) as any;

InputFieldComponent.email = forwardRef(function Email(props, ref) {
   return (
      <InputFieldComponent
         placeholder="your@email.here"
         autoComplete="email"
         keyboardType="email-address"
         autoCapitalize="none"
         autoCorrect={false}
         {...props}
         ref={ref}
      />
   );
}) as InputFieldComponentType[`email`];

InputFieldComponent.password = forwardRef(function Password(props, ref) {
   return (
      <InputFieldComponent
         secureTextEntry
         placeholder="******"
         autoCapitalize="none"
         autoComplete="password"
         autoCorrect={false}
         {...props}
         ref={ref}
      />
   );
}) as InputFieldComponentType[`password`];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
};

InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;

export default InputField;
