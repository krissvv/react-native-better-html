import { memo, useCallback, useEffect, useMemo } from "react";
import { Switch as NativeSwitch, Platform } from "react-native";
import { useBooleanState, useTheme } from "react-better-core";

import { pressStrength } from "../utils/variableFunctions";

import View from "./View";
import Animate from "./Animate";

export type SwitchProps = {
   isEnabled?: boolean;
   defaultIsEnabled?: boolean;
   /** @default false */
   disabled?: boolean;
   onChange?: (isEnabled: boolean) => void;
};

function Switch({ isEnabled, defaultIsEnabled, disabled, onChange }: SwitchProps) {
   const theme = useTheme();

   const [enabled, setEnabled] = useBooleanState(isEnabled ?? defaultIsEnabled);

   const onPressElement = useCallback(() => {
      onChange?.(!enabled);
      setEnabled.toggle();
   }, [onChange, enabled]);

   const trackColor = useMemo(
      () => ({
         false: theme.colors.border,
         true: theme.colors.primary,
      }),
      [theme.colors],
   );

   useEffect(() => {
      if (isEnabled === undefined) return;

      setEnabled.setState(isEnabled);
   }, [isEnabled]);

   const ballSize = 26;
   const ballGap = 3;
   const holderWidth = ballSize * 2.1;

   return Platform.OS === "ios" ? (
      <NativeSwitch
         trackColor={trackColor}
         ios_backgroundColor={theme.colors.border}
         onValueChange={onPressElement}
         value={enabled}
         disabled={disabled}
      />
   ) : (
      <View
         width={holderWidth}
         borderRadius={999}
         pressStrength={pressStrength().p05}
         disabled={disabled}
         onPress={!disabled ? onPressElement : undefined}
      >
         <Animate.View
            width="100%"
            height={ballGap + ballSize + ballGap}
            borderRadius={999}
            initialOpacity={1}
            animateOpacity={disabled ? 0.6 : 1}
            initialBackgroundColor={theme.colors.border}
            animateBackgroundColor={enabled ? theme.colors.primary : theme.colors.border}
         >
            <Animate.View
               width={ballSize}
               height={ballSize}
               top={ballGap}
               borderRadius={999}
               backgroundColor={theme.colors.backgroundContent}
               initialX={ballGap}
               animateX={enabled ? holderWidth - ballGap - ballSize : ballGap}
            />
         </Animate.View>
      </View>
   );
}

export default memo(Switch);
