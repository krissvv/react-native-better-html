import { memo } from "react";
import { useTheme } from "react-better-core";
import { StatusBar as NativeStatusBar } from "react-native";

export type StatusBarProps = {
   darkStatusBar?: boolean;
   /** @default false */
   hidden?: boolean;
};

function StatusBar({ darkStatusBar, hidden }: StatusBarProps) {
   const theme = useTheme();

   return (
      <NativeStatusBar
         backgroundColor={darkStatusBar ? theme.colors.backgroundSecondary : undefined}
         hidden={hidden}
      />
   );
}

export default memo(StatusBar);
