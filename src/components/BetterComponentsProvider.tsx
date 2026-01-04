import { createContext, memo, useContext, useEffect, useMemo } from "react";
import {
   useBooleanState,
   DeepPartialRecord,
   BetterCoreProvider,
   BetterCoreProviderConfig,
   BetterCoreConfig,
   useBetterCoreContext,
} from "react-better-core";

import { appConfig } from "../constants/app";
import { theme } from "../constants/theme";
import { icons } from "../constants/icons";
import { assets } from "../constants/assets";

import { BetterComponentsConfig } from "../types/config";
import { BetterComponentsPlugin, PluginName } from "../types/plugin";

export type BetterComponentsInternalConfig = BetterComponentsConfig & {
   plugins: BetterComponentsPlugin[];
   componentsState: {};
};

const betterComponentsContext = createContext<BetterComponentsInternalConfig | undefined>(undefined);
export let externalBetterCoreContextValue: BetterCoreConfig | undefined;
export let externalBetterComponentsContextValue: BetterComponentsInternalConfig | undefined;

export const useBetterComponentsContext = (): BetterComponentsConfig & BetterCoreConfig => {
   const coreContext = useBetterCoreContext();
   const context = useContext(betterComponentsContext);

   if (context === undefined)
      throw new Error(
         "`useBetterComponentsContext()` must be used within a `<BetterComponentsProvider>`. Make sure to add one at the root of your component tree.",
      );

   const { plugins, componentsState, ...rest } = context;

   return {
      ...coreContext,
      ...rest,
   };
};

export const useBetterComponentsContextInternal = (): BetterComponentsInternalConfig => {
   const context = useContext(betterComponentsContext);

   if (context === undefined)
      throw new Error(
         "`useBetterComponentsContextInternal()` must be used within a `<BetterComponentsProvider>`. Make sure to add one at the root of your component tree.",
      );

   return context;
};

export const usePlugin = <T extends object>(pluginName: PluginName): BetterComponentsPlugin<T> | undefined => {
   const context = useContext(betterComponentsContext);

   if (context === undefined) {
      throw new Error(
         "`usePlugin()` must be used within a `<BetterComponentsProvider>`. Make sure to add one at the root of your component tree.",
      );
   }

   return useMemo(
      () => context.plugins.find((plugin: BetterComponentsPlugin) => plugin.name === pluginName),
      [context.plugins, pluginName],
   ) as any;
};

type BetterComponentsProviderInternalContentProps = {
   children?: React.ReactNode;
};

function BetterComponentsProviderInternalContent({ children }: BetterComponentsProviderInternalContentProps) {
   return <>{children}</>;
}

type BetterComponentsProviderInternalConfig = DeepPartialRecord<BetterComponentsConfig>;

type BetterProviderCommonProps = {
   plugins?: BetterComponentsPlugin[];
   children?: React.ReactNode;
};

type BetterComponentsProviderInternalProps = BetterProviderCommonProps & {
   config?: BetterComponentsProviderInternalConfig;
};

function BetterComponentsProviderInternal({ config, plugins, children }: BetterComponentsProviderInternalProps) {
   const betterCoreContext = useBetterCoreContext();

   const [sideMenuIsCollapsed, setSideMenuIsCollapsed] = useBooleanState();
   const [sideMenuIsOpenMobile, setSideMenuIsOpenMobile] = useBooleanState();

   const readyConfig = useMemo<BetterComponentsInternalConfig>(
      () => ({
         app: {
            ...appConfig,
            ...config?.app,
         },
         sideMenuIsCollapsed,
         setSideMenuIsCollapsed,
         sideMenuIsOpenMobile,
         setSideMenuIsOpenMobile,
         plugins: plugins ?? [],
         componentsState: {},
      }),
      [config, sideMenuIsCollapsed, sideMenuIsOpenMobile, plugins],
   );

   useEffect(() => {
      if (!plugins) return;

      plugins.forEach((plugin) => {
         plugin.initialize?.();
      });
   }, []);

   externalBetterCoreContextValue = betterCoreContext;
   externalBetterComponentsContextValue = readyConfig;

   return (
      <betterComponentsContext.Provider value={readyConfig}>
         <BetterComponentsProviderInternalContent>{children}</BetterComponentsProviderInternalContent>
      </betterComponentsContext.Provider>
   );
}

export type BetterComponentsProviderConfig = BetterCoreProviderConfig & BetterComponentsProviderInternalConfig;

type BetterComponentsProviderProps = BetterProviderCommonProps & {
   config?: BetterComponentsProviderConfig;
};

function BetterComponentsProvider({ config, ...props }: BetterComponentsProviderProps) {
   const coreConfig = useMemo<BetterCoreProviderConfig>(
      () => ({
         theme: {
            ...theme,
            ...config?.theme,
         },
         // colorTheme: config?.colorTheme ?? (localStorage.getItem("theme") === "dark" ? "dark" : "light"),
         colorTheme: config?.colorTheme ?? "light",
         icons: {
            ...icons,
            ...config?.icons,
         },
         assets: {
            ...assets,
            ...config?.assets,
         },
         loaders: config?.loaders,
      }),
      [config],
   );

   const componentsConfig = useMemo<BetterComponentsProviderInternalConfig>(
      () => ({
         app: config?.app,
      }),
      [config],
   );

   return (
      <BetterCoreProvider config={coreConfig}>
         <BetterComponentsProviderInternal config={componentsConfig} {...props} />
      </BetterCoreProvider>
   );
}

export default memo(BetterComponentsProvider);
