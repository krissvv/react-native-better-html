import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, KeyboardEvent, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PartialRecord, useBooleanState, useTheme } from "react-better-core";

import { animateProps, animateTransitionProps, cssProps } from "../constants/css";

import { ComponentPropWithRef, ComponentStyle } from "../types/components";

import { InputFieldProps, InputFieldRef } from "../components/InputField";

export function useDevice() {
   const theme = useTheme();
   const safeAreaInsets = useSafeAreaInsets();

   const screenDimensions = Dimensions.get("screen");
   const windowDimensions = Dimensions.get("window");
   const isSmallDevice = windowDimensions.height <= 700;

   return {
      safeArea: {
         ...safeAreaInsets,
         /** @description The safe area insets after calculations. Recommended to use this instead of the raw insets. */
         afterCalculations: {
            top: safeAreaInsets.top < 25 ? 32 : safeAreaInsets.top < 40 ? 40 : safeAreaInsets.top,
            bottom:
               (safeAreaInsets.bottom === 0 ? theme.styles.space : safeAreaInsets.bottom) +
               (isSmallDevice ? 0 : theme.styles.space * 2),
            left: safeAreaInsets.left,
            right: safeAreaInsets.right,
         },
      },
      /** @description The dimensions of the device screen. */
      screenDimensions,
      /** @description The dimensions of the app window. */
      windowDimensions,
      /** @description Whether the device is small. */
      isSmallDevice,
   };
}

export function useKeyboard() {
   const [keyboardOpened, setKeyboardOpened] = useBooleanState();
   const [keyboardWillOpen, setKeyboardWillOpen] = useBooleanState();

   const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

   useEffect(() => {
      const keyboardDidShow = (event: KeyboardEvent) => {
         setKeyboardOpened.setTrue();
         setKeyboardHeight(event.endCoordinates.height);
      };
      const keyboardDidHide = () => {
         setKeyboardOpened.setFalse();
         setKeyboardHeight(0);
      };

      const willShowSubscription = Keyboard.addListener("keyboardWillShow", setKeyboardWillOpen.setTrue);
      const willHideSubscription = Keyboard.addListener("keyboardWillHide", setKeyboardWillOpen.setFalse);
      const didShowSubscription = Keyboard.addListener("keyboardDidShow", keyboardDidShow);
      const didHideSubscription = Keyboard.addListener("keyboardDidHide", keyboardDidHide);

      return () => {
         willShowSubscription.remove();
         willHideSubscription.remove();
         didShowSubscription.remove();
         didHideSubscription.remove();
      };
   }, []);

   return {
      isOpened: keyboardOpened,
      willOpen: keyboardWillOpen,
      height: keyboardHeight,
   };
}

export function useComponentPropsGrouper<Props extends object = {}>(
   props: ComponentStyle,
   prefix: string,
): {
   style: ComponentStyle;
   withPrefixStyle: ComponentStyle;
   restProps: Props;
} {
   return useMemo(() => {
      const style: ComponentStyle = {};
      const withPrefixStyle: ComponentStyle = {};
      const restProps = {} as Props;

      for (const key in props) {
         const keyName = key as keyof ComponentStyle;

         if (cssProps.has(keyName.toLowerCase())) {
            (style[keyName] as any) = props[keyName];
         } else if (
            keyName.startsWith(prefix) &&
            (cssProps.has(keyName.slice(prefix.length).toLowerCase()) ||
               animateProps.has(keyName.slice(prefix.length).toLowerCase()) ||
               animateTransitionProps.has(keyName.slice(prefix.length).toLowerCase()))
         ) {
            const realKey = `${keyName.slice(prefix.length, prefix.length + 1).toLowerCase()}${keyName.slice(
               prefix.length + 1,
            )}`;

            (withPrefixStyle[realKey as keyof ComponentStyle] as any) = props[keyName];
         } else {
            (restProps[keyName as keyof Props] as any) = props[keyName];
         }
      }

      return {
         style,
         withPrefixStyle,
         restProps,
      };
   }, [props, prefix]);
}

type FormFieldValue = string | number | boolean;

export function useForm<
   FormFields extends Record<string | number, FormFieldValue | FormFieldValue[] | undefined>,
>(options: {
   defaultValues: FormFields;
   requiredFields?: (keyof FormFields)[];
   additional?: {
      /** @default "done" */
      lastInputFieldReturnKeyLabel?: React.ComponentProps<typeof TextInput>["enterKeyHint"];
   };
   onSubmit?: (values: FormFields) => void | Promise<void>;
   validate?: (values: FormFields) => PartialRecord<keyof FormFields, string>;
}) {
   const { defaultValues, requiredFields, additional, onSubmit, validate } = options;

   const inputFieldRefs = useRef<Record<keyof FormFields, InputFieldRef | undefined>>(
      {} as Record<keyof FormFields, InputFieldRef | undefined>,
   );

   const [values, setValues] = useState<FormFields>(defaultValues);
   const [errors, setErrors] = useState<PartialRecord<keyof FormFields, string>>({});
   const [isSubmitting, setIsSubmitting] = useBooleanState();

   const numberOfInputFields = Object.keys(defaultValues).length;

   const setFieldValue = useCallback(
      <FieldName extends keyof FormFields>(field: FieldName, value: FormFields[FieldName] | undefined) => {
         setValues((oldValue) => ({
            ...oldValue,
            [field]: value,
         }));

         setErrors((oldValue) => ({
            ...oldValue,
            [field]: undefined,
         }));
      },
      [],
   );
   const setFieldsValue = useCallback((values: Partial<FormFields>) => {
      setValues((oldValue) => ({
         ...oldValue,
         ...values,
      }));

      setErrors((oldValue) => {
         const newErrors: typeof oldValue = {};

         for (const key in values) newErrors[key] = undefined;

         return newErrors;
      });
   }, []);
   const focusField = useCallback((field: keyof FormFields) => {
      inputFieldRefs.current[field]?.focus();
   }, []);
   const validateForm = useCallback(() => {
      const validationErrors = validate?.(values) || {};
      setErrors(validationErrors);

      return validationErrors;
   }, [validate, values]);
   const onSubmitFunction = useCallback(
      async (event?: React.FormEvent<HTMLFormElement>) => {
         event?.preventDefault();
         setIsSubmitting.setTrue();

         try {
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length === 0) {
               await onSubmit?.(values);
            } else {
               const firstErrorField = Object.keys(validationErrors)[0] as keyof FormFields;
               focusField(firstErrorField);
            }
         } finally {
            setIsSubmitting.setFalse();
         }
      },
      [values, validateForm, onSubmit, focusField],
   );
   const getInputFieldProps = useCallback(
      <FieldName extends keyof FormFields>(
         field: FieldName,
      ): ComponentPropWithRef<InputFieldRef, InputFieldProps> => {
         const thisInputFieldIndex = Object.keys(values).findIndex((key) => key === field);
         const isLastInputField = thisInputFieldIndex === numberOfInputFields - 1;

         return {
            required: requiredFields?.includes(field),
            value: values[field]?.toString() ?? "",
            errorMessage: errors[field],
            returnKeyLabel: isLastInputField ? additional?.lastInputFieldReturnKeyLabel ?? "done" : "next",
            onPressEnter: () => {
               if (isLastInputField) onSubmitFunction();
               else inputFieldRefs.current[Object.keys(values)[thisInputFieldIndex + 1]]?.focus();
            },
            onChange: (value) => {
               setFieldValue(field, value as FormFields[FieldName]);
            },
            ref: (element) => {
               if (!element) return;

               inputFieldRefs.current[field] = element;
            },
         };
      },
      [values, setFieldValue, errors, requiredFields, additional, onSubmitFunction],
   );
   const reset = useCallback(() => {
      setValues(defaultValues);
      setErrors({});
   }, [defaultValues]);

   const isDirty = useMemo<boolean>(
      () => Object.keys(defaultValues).some((key) => defaultValues[key] !== values[key]),
      [defaultValues, values],
   );
   const isValid = useMemo<boolean>(() => {
      const validationErrors = validate?.(values) || {};

      return Object.keys(validationErrors).length === 0;
   }, [validate, values]);
   const canSubmit = useMemo<boolean>(() => {
      const requiredFieldsHaveValues =
         requiredFields?.every((field) => values[field] !== undefined && values[field] !== "") ?? true;

      return isValid && requiredFieldsHaveValues;
   }, [isValid, requiredFields]);

   return {
      values,
      errors,
      isSubmitting,
      setFieldValue,
      setFieldsValue,
      getInputFieldProps,
      focusField,
      inputFieldRefs: inputFieldRefs.current,
      validate: validateForm,
      onSubmit: onSubmitFunction,
      reset,
      requiredFields,
      isDirty,
      isValid,
      canSubmit,
   };
}
