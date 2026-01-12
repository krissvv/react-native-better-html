import { Stack } from "expo-router";

import { alertsPlugin, BetterComponentsPlugin, BetterComponentsProvider, StatusBar } from "../../src/index";

const plugins: BetterComponentsPlugin[] = [alertsPlugin()];

export default function RootLayout() {
   return (
      <BetterComponentsProvider
         config={{
            assets: {
               logo: require("../assets/images/icon.png"),
            },
         }}
         plugins={plugins}
      >
         <StatusBar />

         <Stack />
      </BetterComponentsProvider>
   );
}
