import {
   forwardRef,
   memo,
   useCallback,
   useEffect,
   useImperativeHandle,
   useMemo,
   useRef,
   useState,
} from "react";
import {
   FocusEvent,
   NativeSyntheticEvent,
   NativeTouchEvent,
   TextInput,
   TextInputSubmitEditingEvent,
   TextStyle,
} from "react-native";
import {
   darkenColor,
   lightenColor,
   useBetterCoreContext,
   useBooleanState,
   useTheme,
} from "react-better-core";

import { ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

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
   returnKeyLabel?: React.ComponentProps<typeof TextInput>["enterKeyHint"];
   returnKeyType?: React.ComponentProps<typeof TextInput>["returnKeyType"];
   height?: number;
   /** @default 16 */
   fontSize?: number;
   /** @default 400 */
   fontWeight?: TextStyle["fontWeight"];
   /** @default 20 */
   lineHeight?: number;
   textAlign?: React.ComponentProps<typeof TextInput>["textAlign"];
   onFocus?: (event: FocusEvent) => void;
   onBlur?: (event: FocusEvent) => void;
   onChange?: (text: string) => void;
   onPress?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   onPressEnter?: (event: TextInputSubmitEditingEvent) => void;
} & Pick<ComponentPaddingProps, "paddingHorizontal" | "paddingVertical">;

export type InputFieldRef = TextInput;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<TextInput, InputFieldProps>): React.ReactElement;
   email: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
   code: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef<TextInput, InputFieldProps>(
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
         returnKeyLabel,
         returnKeyType,
         height,
         fontSize = 16,
         fontWeight = 400,
         lineHeight = 20,
         textAlign,
         paddingHorizontal,
         paddingVertical,
         onFocus,
         onBlur,
         onChange,
         onPress,
         onPressEnter,
      },
      ref,
   ) => {
      const theme = useTheme();
      const { colorTheme } = useBetterCoreContext();

      const textInputRef = useRef<TextInput>(null);

      const [internalValue, setInternalValue] = useState(value?.toString() || defaultValue || "");
      const [isFocused, setIsFocused] = useBooleanState();

      const borderWidth = 1;
      const readyPaddingHorizontal = paddingHorizontal ?? theme.styles.space;
      const readyPaddingVertical = paddingVertical
         ? parseFloat(paddingVertical.toString())
         : (theme.styles.space + theme.styles.gap) / 2;
      const readyHeight =
         height ?? borderWidth + readyPaddingVertical + lineHeight + readyPaddingVertical + borderWidth;

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
            fontSize,
            fontWeight,
            lineHeight,
            color: theme.colors.textPrimary,
            paddingHorizontal: readyPaddingHorizontal,
            paddingVertical: readyPaddingVertical,
         }),
         [theme.colors, fontSize, fontWeight, lineHeight, readyPaddingHorizontal, readyPaddingVertical],
      );

      useEffect(() => {
         if (value === undefined) return;

         setInternalValue(value.toString());
      }, [value]);

      useImperativeHandle(
         ref,
         (): TextInput => {
            return textInputRef.current!;
         },
         [],
      );

      const prefixSuffixBackgroundColor =
         colorTheme === "light"
            ? darkenColor(theme.colors.backgroundContent, 0.03)
            : lightenColor(theme.colors.backgroundContent, 0.1);

      return (
         <View isRow position="relative" alignItems="center" flex={1} height={readyHeight}>
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
                  paddingHorizontal={readyPaddingHorizontal}
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
                  enterKeyHint={returnKeyLabel}
                  returnKeyType={returnKeyType}
                  onSubmitEditing={onPressEnter}
                  readOnly={!editable}
                  textAlign={textAlign}
                  keyboardAppearance={keyboardAppearance}
                  keyboardType={keyboardType}
                  cursorColor={theme.colors.primary}
                  selectionColor={theme.colors.primary}
                  secureTextEntry={secureTextEntry}
                  onFocus={onFocusElement}
                  onBlur={onBlurElement}
                  onChangeText={onChangeText}
                  onPress={onPress}
                  ref={textInputRef}
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
                  paddingHorizontal={readyPaddingHorizontal}
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

InputFieldComponent.code = forwardRef(function Password(props, ref) {
   const theme = useTheme();

   return (
      <InputFieldComponent
         fontSize={42}
         fontWeight={900}
         lineHeight={50}
         paddingVertical={theme.styles.space * 2}
         textAlign="center"
         {...props}
         ref={ref}
      />
   );
}) as InputFieldComponentType[`code`];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   code: typeof InputFieldComponent.code;
};

InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.code = InputFieldComponent.code;

export default InputField;
