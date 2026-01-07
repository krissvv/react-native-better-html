import { memo } from "react";
import { AnyOtherString, IconName, useTheme } from "react-better-core";

import { useDevice } from "../utils/hooks";
import { pressStrength } from "../utils/variableFunctions";

import View, { ViewProps } from "./View";
import Text from "./Text";
import Icon, { IconNameIOS } from "./Icon";
import Switch from "./Switch";

export type ListItemProps = {
   icon?: IconName | AnyOtherString;
   iconIOS?: IconNameIOS;
   title?: string;
   description?: string;
   rightElement?: "arrow" | "switch";
   /** @default theme.colors.backgroundBase */
   backgroundColor?: ViewProps["backgroundColor"];
   /** @default false */
   insideScreenHolder?: boolean;
   onPress?: () => void;
   rightArrowValue?: string | number;
   switchIsEnabled?: boolean;
   switchOnChange?: (isEnabled: boolean) => void;
};

function ListItem({
   icon,
   iconIOS,
   title,
   description,
   rightElement,
   backgroundColor,
   insideScreenHolder,
   onPress,
   rightArrowValue,
   switchIsEnabled,
   switchOnChange,
}: ListItemProps) {
   const theme = useTheme();
   const device = useDevice();

   const sideSpace = theme.styles.space;

   return (
      <View
         width={insideScreenHolder ? device.windowDimensions.width : "100%"}
         backgroundColor={backgroundColor ?? theme.colors.backgroundBase}
         marginHorizontal={insideScreenHolder ? -sideSpace : undefined}
         paddingVertical={theme.styles.gap}
         paddingHorizontal={sideSpace}
         pressStrength={pressStrength().p05}
         onPress={onPress}
      >
         <View isRow alignItems="center" gap={theme.styles.space}>
            {icon && <Icon name={icon} nameIOS={iconIOS} size={22} color={theme.colors.primary} />}

            <View flex={1} flexDirection="row" alignItems="center" gap={theme.styles.gap}>
               <View flex={1}>
                  {title && (
                     <Text fontSize={20} fontWeight={700}>
                        {title}
                     </Text>
                  )}

                  {description && <Text.body>{description}</Text.body>}
               </View>
            </View>

            {rightElement ? (
               <>
                  {rightElement === "arrow" ? (
                     <View isRow alignItems="center" gap={theme.styles.gap / 2}>
                        {rightArrowValue !== undefined && (
                           <Text fontSize={14} fontWeight={700}>
                              {rightArrowValue}
                           </Text>
                        )}

                        <Icon
                           name="chevronRight"
                           nameIOS="chevron.right"
                           color={
                              rightArrowValue !== undefined
                                 ? theme.colors.textPrimary
                                 : theme.colors.textSecondary
                           }
                        />
                     </View>
                  ) : rightElement === "switch" ? (
                     <Switch isEnabled={switchIsEnabled} onChange={switchOnChange} />
                  ) : undefined}
               </>
            ) : undefined}
         </View>
      </View>
   );
}

export default memo(ListItem);
