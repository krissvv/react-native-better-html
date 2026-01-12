import { memo } from "react";
import { useTheme } from "react-better-core";

import { AlertsPluginOptions } from "../../plugins/alerts";

import { useDevice } from "../../utils/hooks";

import View from "../View";
import Alert from "./Alert";
import { useBetterComponentsContextInternal, usePlugin } from "../BetterComponentsProvider";

function AlertsHolder() {
   const theme = useTheme();
   const device = useDevice();
   const alertsPlugin = usePlugin<AlertsPluginOptions>("alerts");
   const { alerts } = useBetterComponentsContextInternal();

   const pluginConfig = alertsPlugin?.getConfig() ?? {};

   return (
      <View
         position="absolute"
         width="100%"
         top={device.safeArea.afterCalculations.top + theme.styles.gap / 2}
         left={0}
         gap={theme.styles.gap}
         alignItems={
            pluginConfig.align === "left"
               ? "flex-start"
               : pluginConfig.align === "center"
               ? "center"
               : pluginConfig.align === "right"
               ? "flex-end"
               : undefined
         }
         paddingHorizontal={theme.styles.space}
         pointerEvents="box-none"
         zIndex={1000}
      >
         {alerts.map((alert) => (
            <Alert alert={alert} key={alert.id} />
         ))}
      </View>
   );
}

export default memo(AlertsHolder);
