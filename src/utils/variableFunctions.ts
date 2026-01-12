import { BetterCoreConfig, generateRandomString, OmitProps } from "react-better-core";

import { Alert } from "../types/alert";

import {
   BetterComponentsInternalConfig,
   externalBetterComponentsContextValue,
   externalBetterCoreContextValue,
} from "../components/BetterComponentsProvider";

export const checkBetterCoreContextValue = (
   value: BetterCoreConfig | undefined,
   functionsName: string,
): value is BetterCoreConfig => {
   if (value === undefined) {
      throw new Error(
         `\`${functionsName}()\` must be used within a \`<BetterCoreProvider>\`. Make sure to add one at the root of your component tree.`,
      );
   }

   return value !== undefined;
};
export const checkBetterComponentsContextValue = (
   value: BetterComponentsInternalConfig | undefined,
   functionsName: string,
): value is BetterComponentsInternalConfig => {
   if (value === undefined) {
      throw new Error(
         `\`${functionsName}()\` must be used within a \`<BetterComponentsProvider>\`. Make sure to add one at the root of your component tree.`,
      );
   }

   return value !== undefined;
};

export const alertControls = {
   createAlert: (alert: OmitProps<Alert, "id">): Alert => {
      if (
         !checkBetterComponentsContextValue(externalBetterComponentsContextValue, "alertControls.createAlert")
      )
         return undefined as any;

      const readyAlert: Alert = {
         id: generateRandomString(36),
         ...alert,
      };
      externalBetterComponentsContextValue.setAlerts((oldValue) => [...oldValue, readyAlert]);

      return readyAlert;
   },
   removeAlert: (alertId: string) => {
      if (
         !checkBetterComponentsContextValue(externalBetterComponentsContextValue, "alertControls.removeAlert")
      )
         return;

      externalBetterComponentsContextValue.setAlerts((oldValue) =>
         oldValue.filter((alert) => alert.id !== alertId),
      );
   },
};

export const pressStrength = (): Record<"p05" | "p1" | "p2" | "p3", number> => {
   if (!checkBetterCoreContextValue(externalBetterCoreContextValue, "pressStrength")) return undefined as any;

   return {
      p05: externalBetterCoreContextValue.colorTheme === "dark" ? 0.85 : 0.95,
      p1: externalBetterCoreContextValue.colorTheme === "dark" ? 0.6 : 0.8,
      p2: externalBetterCoreContextValue.colorTheme === "dark" ? 0.5 : 0.7,
      p3: externalBetterCoreContextValue.colorTheme === "dark" ? 0.4 : 0.6,
   };
};
