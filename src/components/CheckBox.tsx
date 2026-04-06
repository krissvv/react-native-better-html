import { memo, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useBooleanState, useTheme } from "react-better-core";

import { pressStrength } from "../utils/variableFunctions";

import View from "./View";
import Animate from "./Animate";
import Icon from "./Icon";

export type CheckBoxProps = {
   isChecked?: boolean;
   defaultIsChecked?: boolean;
   /** @default 36 */
   size?: number;
   /** @default false */
   disabled?: boolean;
   onChange?: (isChecked: boolean) => void;
};

function CheckBox({ isChecked, defaultIsChecked, size = 36, disabled, onChange }: CheckBoxProps) {
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

   return (
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
}

export default memo(CheckBox);
