import { PartialRecord } from "react-better-core";

import { AlertDisplay, AlertDuration, AlertType } from "../types/alert";
import { BetterComponentsPluginConstructor } from "../types/plugin";

export type AlertsPluginOptions = {
   /** @default "right" */
   align?: "left" | "center" | "right";
   /** @default "auto" */
   defaultDuration?: AlertDuration;
   defaultDisplay?: PartialRecord<AlertType, AlertDisplay>;
   /** @default true */
   withCloseButton?: boolean;
};

export const defaultAlertsPluginOptions: Required<AlertsPluginOptions> = {
   align: "right",
   defaultDuration: "auto",
   defaultDisplay: {},
   withCloseButton: true,
};

export const alertsPlugin: BetterComponentsPluginConstructor<AlertsPluginOptions> = (options) => ({
   name: "alerts",
   initialize: () => {
      // console.log("alerts plugin initialized");
   },
   getConfig: () => ({
      ...defaultAlertsPluginOptions,
      ...options,
   }),
});
