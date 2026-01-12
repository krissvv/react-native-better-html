export type PluginName = "alerts" | "asyncStorage";

export type BetterComponentsPluginConstructor<T extends object = object> = (
   config?: T,
) => BetterComponentsPlugin<T>;

export type BetterComponentsPlugin<T = object> = {
   name: PluginName;
   initialize?: () => void;
   getConfig: () => T;
};
