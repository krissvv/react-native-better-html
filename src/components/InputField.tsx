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
   Platform,
   TextInput,
   TextInputSubmitEditingEvent,
   TextStyle,
   ViewStyle,
} from "react-native";
import RNDateTimePicker, {
   DateTimePickerAndroid,
   DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
   darkenColor,
   lightenColor,
   useBetterCoreContext,
   useBooleanState,
   useTheme,
} from "react-better-core";

import { ComponentMarginProps, ComponentPaddingProps, ComponentPropWithRef } from "../types/components";

import View from "./View";
import Text from "./Text";
import Animate from "./Animate";
import Icon, { IconProps } from "./Icon";

export type InputFieldProps = {
   flex?: ViewStyle["flex"];
   placeholder?: string;
   /** @default "text" */
   type?: "text" | "date" | "time";
   /** @default false */
   iOSDateTimeFullSize?: boolean;
   prefix?: string | React.ReactNode;
   suffix?: string | React.ReactNode;
   defaultValue?: string;
   value?: string | number;
   /** @default true */
   editable?: boolean;
   label?: string;
   isError?: boolean;
   infoMessage?: string;
   errorMessage?: string;
   /** @default false */
   autoFocus?: boolean;
   autoCapitalize?: React.ComponentProps<typeof TextInput>["autoCapitalize"];
   autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
   autoCorrect?: React.ComponentProps<typeof TextInput>["autoCorrect"];
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
   /** @default false */
   required?: boolean;
   /** @default false */
   disabled?: boolean;
   maxLength?: number;
   /** @default false */
   multiline?: boolean;
   /** @default 2 */
   numberOfLines?: number;
   leftIcon?: IconProps["name"];
   leftIconIOS?: IconProps["nameIOS"];
   onPressLeftIcon?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   rightIcon?: IconProps["name"];
   rightIconIOS?: IconProps["nameIOS"];
   onPressRightIcon?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   onFocus?: (event: FocusEvent) => void;
   onBlur?: (event: FocusEvent) => void;
   onChange?: (text: string) => void;
   onPress?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   onPressPrefix?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   onPressSuffix?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
   onPressEnter?: (event: TextInputSubmitEditingEvent) => void;
} & Pick<ComponentPaddingProps, "paddingHorizontal" | "paddingVertical"> &
   ComponentMarginProps;

export type InputFieldRef = TextInput;

type InputFieldComponentType = {
   (props: ComponentPropWithRef<TextInput, InputFieldProps>): React.ReactElement;
   email: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
   password: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
   search: (props: ComponentPropWithRef<TextInput, InputFieldProps>) => React.ReactElement;
   code: (
      props: ComponentPropWithRef<
         TextInput,
         InputFieldProps & {
            /** @default false */
            isSmall?: boolean;
         }
      >,
   ) => React.ReactElement;
};

const InputFieldComponent: InputFieldComponentType = forwardRef<TextInput, InputFieldProps>(
   (
      {
         flex,
         placeholder,
         type = "text",
         iOSDateTimeFullSize,
         prefix,
         suffix,
         defaultValue,
         value,
         editable = true,
         label,
         isError,
         infoMessage,
         errorMessage,
         autoFocus,
         autoCapitalize,
         autoComplete,
         autoCorrect,
         keyboardAppearance,
         keyboardType,
         secureTextEntry,
         returnKeyLabel,
         returnKeyType,
         height,
         fontSize = 16,
         fontWeight = 400,
         lineHeight = 20,
         textAlign,
         required,
         disabled,
         maxLength,
         multiline,
         numberOfLines = 2,
         leftIcon,
         leftIconIOS,
         onPressLeftIcon,
         rightIcon,
         rightIconIOS,
         onPressRightIcon,
         paddingHorizontal,
         paddingVertical,
         onFocus,
         onBlur,
         onChange,
         onPress,
         onPressPrefix,
         onPressSuffix,
         onPressEnter,
         ...props
      },
      ref,
   ) => {
      const theme = useTheme();
      const { colorTheme } = useBetterCoreContext();

      const textInputRef = useRef<TextInput>(null);

      const [internalValue, setInternalValue] = useState(value?.toString() || defaultValue || "");
      const [internalDateValue, setInternalDateValue] = useState<Date>();
      const [isFocused, setIsFocused] = useBooleanState();

      const isIOSDateTime = Platform.OS === "ios" && (type === "date" || type === "time");

      const iconSize = 16;
      const iconPadding = onPressRightIcon ? theme.styles.gap : 0;
      const iconSideSpace = theme.styles.space;
      const borderWidth = 1;
      const readyPaddingHorizontal = paddingHorizontal ?? theme.styles.space;
      const readyPaddingVertical = paddingVertical
         ? parseFloat(paddingVertical.toString())
         : (theme.styles.space + theme.styles.gap) / 2;
      const readyHeight =
         height ?? isIOSDateTime
            ? undefined
            : borderWidth +
              readyPaddingVertical +
              lineHeight +
              readyPaddingVertical +
              borderWidth +
              (Platform.OS === "android" ? 2 : 0);

      const onChangeRNDateTimePicker = useCallback(
         (event: DateTimePickerEvent, data?: Date) => {
            setInternalDateValue(data);
            onChange?.(data?.toISOString() ?? "");
         },
         [onChange],
      );
      const onPressInputField = useCallback(
         (event: NativeSyntheticEvent<NativeTouchEvent>) => {
            onPress?.(event);

            if (type === "date" || type === "time") {
               if (Platform.OS === "android") {
                  DateTimePickerAndroid.open({
                     value: internalDateValue ?? new Date(),
                     is24Hour: true,
                     mode: type,
                     positiveButton: {
                        label: "Done",
                     },
                     negativeButton: {
                        label: "Clear",
                        textColor: theme.colors.textSecondary,
                     },
                     neutralButton: {
                        label: "Cancel",
                        textColor: theme.colors.textSecondary,
                     },
                     onChange: onChangeRNDateTimePicker,
                  });
               } else if (Platform.OS === "ios") {
               }
            }
         },
         [onPress, type, internalDateValue, onChangeRNDateTimePicker],
      );
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
            paddingLeft: leftIcon ? iconSideSpace + iconSize + iconSideSpace : undefined,
            paddingRight: rightIcon ? iconSideSpace + iconSize + iconSideSpace : undefined,
            paddingHorizontal: readyPaddingHorizontal,
            paddingVertical: readyPaddingVertical,
         }),
         [
            theme.colors,
            fontSize,
            fontWeight,
            lineHeight,
            readyPaddingHorizontal,
            readyPaddingVertical,
            iconSideSpace,
            iconSize,
            leftIcon,
            rightIcon,
         ],
      );
      const rnDateTimePickerStyle = useMemo<ViewStyle>(
         () => ({
            flex: iOSDateTimeFullSize ? 1 : undefined,
            marginLeft: -8 + (iOSDateTimeFullSize ? 0 : theme.styles.space),
         }),
         [iOSDateTimeFullSize],
      );

      useEffect(() => {
         if (value === undefined) return;

         setInternalValue(value.toString());

         try {
            setInternalDateValue(value ? new Date(value) : undefined);
         } catch (error) {}
      }, [value]);
      useEffect(() => {
         if (type !== "date" && type !== "time") return;

         const date = internalDateValue?.toISOString().split("T")[0] ?? "";

         const hours = internalDateValue ? internalDateValue.getHours().toString() : "00";
         const minutes = internalDateValue ? internalDateValue.getMinutes().toString() : "00";

         setInternalValue(
            type === "date"
               ? date
               : internalDateValue
               ? `${hours.length === 1 ? `0${hours}` : hours}:${
                    minutes.length === 1 ? `0${minutes}` : minutes
                 }`
               : "",
         );
      }, [internalDateValue]);

      useImperativeHandle(
         ref,
         (): TextInput => {
            return textInputRef.current!;
         },
         [],
      );

      const withPressInputField = !!onPress || type === "date" || type === "time";
      const prefixSuffixBackgroundColor =
         colorTheme === "light"
            ? darkenColor(theme.colors.backgroundContent, 0.03)
            : lightenColor(theme.colors.backgroundContent, 0.1);

      const labelComponent = label && (
         <View isRow alignItems="center" gap={2}>
            <Text fontSize={14} color={isError ? theme.colors.error : theme.colors.textSecondary}>
               {label}
            </Text>

            {required && <Text color={theme.colors.error}>*</Text>}
         </View>
      );

      return (
         <Animate.View
            flex={flex}
            gap={theme.styles.gap / 3}
            initialOpacity={1}
            animateOpacity={disabled ? 0.6 : 1}
            {...props}
         >
            {isIOSDateTime && !iOSDateTimeFullSize ? undefined : labelComponent}

            <View isRow position="relative" alignItems="center" height={readyHeight}>
               {prefix && (
                  <View
                     isRow
                     height="100%"
                     backgroundColor={prefixSuffixBackgroundColor}
                     alignItems="center"
                     justifyContent="center"
                     borderWidth={borderWidth}
                     borderRightWidth={0}
                     borderTopLeftRadius={theme.styles.borderRadius}
                     borderBottomLeftRadius={theme.styles.borderRadius}
                     borderColor={theme.colors.border}
                     paddingHorizontal={readyPaddingHorizontal}
                     onPress={onPressPrefix}
                  >
                     {typeof prefix === "string" ? (
                        <Text
                           fontWeight={700}
                           lineHeight={lineHeight}
                           marginTop={
                              Platform.OS === "ios" && onPressPrefix ? readyPaddingVertical : undefined
                           }
                        >
                           {prefix}
                        </Text>
                     ) : (
                        prefix
                     )}
                  </View>
               )}

               {isIOSDateTime ? (
                  <>
                     {!iOSDateTimeFullSize ? labelComponent : undefined}

                     <RNDateTimePicker
                        value={internalDateValue ?? new Date()}
                        mode={type}
                        display={iOSDateTimeFullSize ? (type === "date" ? "inline" : "spinner") : "default"}
                        accentColor={theme.colors.primary}
                        themeVariant={colorTheme === "dark" ? "dark" : "light"}
                        style={rnDateTimePickerStyle}
                        onChange={onChangeRNDateTimePicker}
                     />
                  </>
               ) : (
                  <View
                     flex={1}
                     width="100%"
                     borderTopLeftRadius={prefix ? 0 : theme.styles.borderRadius}
                     borderBottomLeftRadius={prefix ? 0 : theme.styles.borderRadius}
                     borderTopRightRadius={suffix ? 0 : theme.styles.borderRadius}
                     borderBottomRightRadius={suffix ? 0 : theme.styles.borderRadius}
                     pressStrength={1}
                     onPress={
                        Platform.OS === "android"
                           ? editable === false || withPressInputField
                              ? onPressInputField
                              : undefined
                           : undefined
                     }
                  >
                     <Animate.View
                        position="relative"
                        flex={1}
                        justifyContent="center"
                        backgroundColor={theme.colors.backgroundContent}
                        borderTopLeftRadius={prefix ? 0 : theme.styles.borderRadius}
                        borderBottomLeftRadius={prefix ? 0 : theme.styles.borderRadius}
                        borderTopRightRadius={suffix ? 0 : theme.styles.borderRadius}
                        borderBottomRightRadius={suffix ? 0 : theme.styles.borderRadius}
                        borderWidth={borderWidth}
                        initialBorderColor={theme.colors.border}
                        animateBorderColor={
                           isFocused
                              ? theme.colors.primary
                              : isError
                              ? theme.colors.error
                              : theme.colors.border
                        }
                        overflow="hidden"
                     >
                        {leftIcon && (
                           <Icon
                              position="absolute"
                              left={iconSideSpace - iconPadding}
                              name={leftIcon}
                              nameIOS={leftIconIOS}
                              size={iconSize}
                              pointerEvents={!onPressLeftIcon ? "box-none" : undefined}
                              padding={iconPadding}
                              onPress={onPressLeftIcon}
                           />
                        )}

                        <TextInput
                           style={textInputStyle}
                           value={internalValue}
                           defaultValue={defaultValue}
                           autoCapitalize={autoCapitalize}
                           autoComplete={autoComplete}
                           autoCorrect={autoCorrect}
                           autoFocus={autoFocus}
                           placeholder={placeholder ?? label}
                           placeholderTextColor={theme.colors.textSecondary + "80"}
                           enterKeyHint={returnKeyLabel}
                           returnKeyType={returnKeyType}
                           onSubmitEditing={onPressEnter}
                           readOnly={!editable || disabled || type === "date" || type === "time"}
                           textAlign={textAlign}
                           editable={!disabled}
                           keyboardAppearance={keyboardAppearance ?? colorTheme === "dark" ? "dark" : "light"}
                           keyboardType={keyboardType}
                           cursorColor={theme.colors.primary}
                           selectionColor={theme.colors.primary}
                           secureTextEntry={secureTextEntry}
                           // clearButtonMode={clearButtonMode}
                           onFocus={onFocusElement}
                           onBlur={onBlurElement}
                           onChangeText={onChangeText}
                           maxLength={maxLength}
                           multiline={multiline}
                           numberOfLines={numberOfLines}
                           onPress={withPressInputField ? onPressInputField : undefined}
                           ref={textInputRef}
                        />

                        {rightIcon && (
                           <Icon
                              position="absolute"
                              right={iconSideSpace - iconPadding}
                              name={rightIcon}
                              nameIOS={rightIconIOS}
                              size={iconSize}
                              pointerEvents={!onPressRightIcon ? "box-none" : undefined}
                              padding={iconPadding}
                              onPress={onPressRightIcon}
                           />
                        )}
                     </Animate.View>
                  </View>
               )}

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
                     onPress={onPressSuffix}
                  >
                     {typeof suffix === "string" ? (
                        <Text
                           fontWeight={700}
                           lineHeight={lineHeight}
                           marginTop={
                              Platform.OS === "ios" && onPressSuffix ? readyPaddingVertical : undefined
                           }
                        >
                           {suffix}
                        </Text>
                     ) : (
                        suffix
                     )}
                  </View>
               )}
            </View>

            {infoMessage && (
               <Animate.Text
                  fontSize={14}
                  color={theme.colors.textSecondary}
                  initialHeight={0}
                  initialOpacity={0}
                  animateHeight={17}
                  animateOpacity={1}
               >
                  {infoMessage}
               </Animate.Text>
            )}
            {errorMessage && (
               <Animate.Text
                  fontSize={14}
                  color={theme.colors.error}
                  initialHeight={0}
                  initialOpacity={0}
                  animateHeight={17}
                  animateOpacity={1}
               >
                  {errorMessage}
               </Animate.Text>
            )}
         </Animate.View>
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
   const inputFieldRef = useRef<InputFieldRef>(null);

   const [showPassword, setShowPassword] = useBooleanState();

   const onPressEye = useCallback(() => {
      setShowPassword.toggle();
      inputFieldRef.current?.focus();
   }, []);

   useImperativeHandle(
      ref,
      (): TextInput => {
         return inputFieldRef.current!;
      },
      [],
   );

   return (
      <InputFieldComponent
         secureTextEntry={!showPassword}
         placeholder="******"
         autoCapitalize="none"
         autoComplete="password"
         autoCorrect={false}
         rightIcon={showPassword ? "eyeDashed" : "eye"}
         onPressRightIcon={onPressEye}
         {...props}
         ref={inputFieldRef}
      />
   );
}) as InputFieldComponentType[`password`];

InputFieldComponent.search = forwardRef(function Search(props, ref) {
   return <InputFieldComponent placeholder="Search..." leftIcon="magnifyingGlass" {...props} ref={ref} />;
}) as InputFieldComponentType[`search`];

InputFieldComponent.code = forwardRef(function Password({ isSmall, ...props }, ref) {
   const theme = useTheme();

   return (
      <InputFieldComponent
         flex={1}
         fontSize={isSmall ? 36 : 42}
         fontWeight={900}
         lineHeight={isSmall ? 42 : 50}
         paddingVertical={isSmall ? theme.styles.space : theme.styles.space * 2}
         paddingHorizontal={isSmall ? theme.styles.gap : undefined}
         textAlign="center"
         {...props}
         ref={ref}
      />
   );
}) as InputFieldComponentType[`code`];

const InputField = memo(InputFieldComponent) as any as typeof InputFieldComponent & {
   email: typeof InputFieldComponent.email;
   password: typeof InputFieldComponent.password;
   search: typeof InputFieldComponent.search;
   code: typeof InputFieldComponent.code;
};

InputField.email = InputFieldComponent.email;
InputField.password = InputFieldComponent.password;
InputField.search = InputFieldComponent.search;
InputField.code = InputFieldComponent.code;

export default InputField;
