import { memo, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useBooleanState, useTheme } from "react-better-core";

import { pressStrength } from "../utils/variableFunctions";

import View from "./View";
import Animate from "./Animate";
import Icon from "./Icon";
import Text from "./Text";
import Label from "./Label";

export type CheckBoxProps = {
   isChecked?: boolean;
   defaultIsChecked?: boolean;
   /** @default 36 */
   size?: number;
   text?: string | React.ReactNode;
   /** @default false */
   required?: boolean;
   /** @default false */
   disabled?: boolean;
   onChange?: (isChecked: boolean) => void;
};

function CheckBox({
   isChecked,
   defaultIsChecked,
   size = 36,
   text,
   required,
   disabled,
   onChange,
}: CheckBoxProps) {
   const theme = useTheme();

   const [checked, setChecked] = useBooleanState(isChecked ?? defaultIsChecked);

   const onPressElement = useCallback(() => {
      onChange?.(!checked);
      setChecked.toggle();
   }, [onChange, checked]);

   useEffect(() => {
      if (isChecked === undefined) return;

      setChecked.setState(isChecked);
   }, [isChecked]);

   const checkBox = (
      <View
         width={size}
         borderRadius={theme.styles.borderRadius}
         pressStrength={pressStrength().p05}
         disabled={disabled}
         onPress={!disabled ? onPressElement : undefined}
      >
         <Animate.View
            width="100%"
            height={size}
            borderWidth={1}
            borderRadius={theme.styles.borderRadius}
            initialBackgroundColor={theme.colors.backgroundContent}
            animateBackgroundColor={checked ? theme.colors.primary : theme.colors.backgroundContent}
            initialBorderColor={theme.colors.border}
            animateBorderColor={checked ? theme.colors.primary : theme.colors.border}
            initialOpacity={1}
            animateOpacity={disabled ? 0.6 : 1}
         >
            <Animate.View
               width="100%"
               height="100%"
               alignItems="center"
               justifyContent="center"
               transitionType="spring"
               transitionDamping={20}
               transitionStiffness={230}
               initialScale={0}
               animateScale={checked ? 1 : 0}
            >
               <Icon
                  name="check"
                  nameIOS="checkmark"
                  size={size * (Platform.OS === "ios" ? 0.5 : 0.6)}
                  color={theme.colors.base}
               />
            </Animate.View>
         </Animate.View>
      </View>
   );

   return text ? (
      <>
         <View isRow alignItems="center" gap={theme.styles.gap}>
            {checkBox}

            <View
               width={"100%"}
               flexShrink={1}
               pressType="opacity"
               pressStrength={pressStrength().p3}
               onPress={onPressElement}
            >
               <View isRow alignItems="flex-start" gap={2}>
                  <View flexShrink={1}>{typeof text === "string" ? <Text>{text}</Text> : text}</View>

                  {required && <Label required />}
               </View>
            </View>
         </View>
      </>
   ) : (
      checkBox
   );
}

export default memo(CheckBox);
