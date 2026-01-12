import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useBooleanState, useTheme } from "react-better-core";

import { defaultAlertDuration } from "../../constants/app";

import { AlertsPluginOptions, defaultAlertsPluginOptions } from "../../plugins";

import { AlertDisplay, AlertDuration, Alert as AlertT, AlertType } from "../../types/alert";

import View from "../View";
import Text from "../Text";
import Icon, { IconNameIOS } from "../Icon";
import Button from "../Button";
import Animate, { defaultTransitionDuration } from "../Animate";
import { useAlertControls, usePlugin } from "../BetterComponentsProvider";

const getAlertDurationFromAuto = (duration: AlertDuration, alert: AlertT): number => {
   if (duration === "auto") {
      const titleLength: number = alert.title?.length ?? 0;
      const messageLength: number = alert.message?.length ?? 0;

      return Math.max(defaultAlertDuration, (titleLength + messageLength) * 30);
   }

   return duration;
};

type AlertData = {
   icon: string;
   iconIOS?: IconNameIOS;
   iconColor?: string;
   backgroundColor: string;
   title: string;
};

type AlertProps = {
   alert: AlertT;
};

function Alert({ alert }: AlertProps) {
   const theme = useTheme();
   const alertControls = useAlertControls();
   const alertsPlugin = usePlugin<AlertsPluginOptions>("alerts");

   const pluginConfig = alertsPlugin?.getConfig() ?? {};

   const defaultAlertDurationNumber: number = getAlertDurationFromAuto(
      alert.duration ?? pluginConfig.defaultDuration ?? defaultAlertsPluginOptions.defaultDuration,
      alert,
   );
   const defaultAlertDisplay: AlertDisplay =
      alert.display ??
      pluginConfig.defaultDisplay?.[alert.type] ??
      defaultAlertsPluginOptions.defaultDisplay[alert.type] ??
      "default";

   const calledOnCloseRef = useRef<boolean>(false);

   const [isRemoved, setIsRemoved] = useBooleanState();

   const onPressCloseAlert = useCallback(() => {
      setIsRemoved.setTrue();

      setTimeout(() => {
         alertControls.removeAlert(alert.id);

         if (!calledOnCloseRef.current) {
            alert.onClose?.(alert);
            calledOnCloseRef.current = true;
         }
      }, defaultTransitionDuration);
   }, [alert]);

   const alertData = useMemo<Record<AlertType, AlertData>>(
      () => ({
         info: {
            icon: "infoI",
            iconIOS: "info",
            backgroundColor: theme.colors.info,
            title: "Info",
         },
         success: {
            icon: "check",
            backgroundColor: theme.colors.success,
            title: "Success",
         },
         warning: {
            icon: "warningTriangle",
            backgroundColor: theme.colors.warn,
            title: "Warning",
         },
         error: {
            icon: "XMark",
            backgroundColor: theme.colors.error,
            title: "Error",
         },
      }),
      [theme],
   );

   useEffect(() => {
      const timeout = setTimeout(onPressCloseAlert, defaultAlertDurationNumber);

      return () => {
         clearTimeout(timeout);
      };
   }, [onPressCloseAlert, defaultAlertDurationNumber]);

   return defaultAlertDisplay === "prominent" ? (
      <></>
   ) : (
      <Animate.View
         initialOpacity={0}
         animateOpacity={isRemoved ? 0 : 1}
         initialX={40}
         animateX={isRemoved ? 40 : 0}
      >
         <View.box width="auto" withShadow>
            <View isRow alignItems="center" gap={theme.styles.space}>
               <View
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={alertData[alert.type].backgroundColor}
                  borderRadius={999}
                  padding={(theme.styles.space + theme.styles.gap) / 2}
               >
                  <Icon
                     name={alertData[alert.type].icon}
                     color={alertData[alert.type].iconColor ?? theme.colors.base}
                  />
               </View>

               <View>
                  <Text fontSize={18} fontWeight={700}>
                     {alert.title ?? alertData[alert.type].title}
                  </Text>
                  <Text.body>{alert.message}</Text.body>
               </View>

               {pluginConfig.withCloseButton && <Button.icon icon="XMark" onPress={onPressCloseAlert} />}
            </View>
         </View.box>
      </Animate.View>
   );
}

export default memo(Alert);
