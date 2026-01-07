import { useEffect } from "react";
import { Platform } from "react-native";
import { Path, Svg } from "react-native-svg";
import { AnyOtherString, IconName, OmitProps, useBetterCoreContext, useTheme } from "react-better-core";
import { SymbolView } from "expo-symbols";

import { pressStrength } from "../utils/variableFunctions";

import View, { ViewProps } from "./View";

export type IconProps = {
   name: IconName | AnyOtherString;
   nameIOS?: React.ComponentProps<typeof SymbolView>["name"];
   /** @default 16 */
   size?: number;
   color?: string;
} & OmitProps<ViewProps, "width" | "height" | "pressType">;

function Icon({ name, nameIOS, size = 16, color, ...props }: IconProps) {
   const theme = useTheme();
   const { icons } = useBetterCoreContext();

   const svgColor = color ?? theme.colors.textPrimary;

   useEffect(() => {
      if (!icons[name.toString()])
         console.warn(
            `The icon \`${name}\` you are trying to use does not exist. Make sure to add it to the \`icons\` object in \`<BetterComponentsProvider>\` config value prop.`,
         );
   }, [icons, name]);

   return (
      <View width={size} height={size} pressType="opacity" pressStrength={pressStrength().p2} {...props}>
         {Platform.OS === "ios" && nameIOS ? (
            <SymbolView name={nameIOS} tintColor={svgColor} size={size} />
         ) : (
            <Svg
               width={size}
               height={size}
               viewBox={`0 0 ${icons[name.toString()]?.width ?? 0} ${icons[name.toString()]?.height ?? 0}`}
               fill="none"
            >
               {icons[name.toString()]?.paths.map(({ type, ...path }) => (
                  <Path
                     {...(path as any)}
                     fill={type === "fill" ? svgColor : undefined}
                     stroke={type === "stroke" ? svgColor : undefined}
                     key={path.d}
                  />
               ))}
            </Svg>
         )}
      </View>
   );
}

export default Icon;
