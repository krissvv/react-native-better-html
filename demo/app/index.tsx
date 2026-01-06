import { memo, useState } from "react";
import { Stack } from "expo-router";

import { Animate, Button, Image, InputField, ScreenHolder, Text, useTheme, View } from "../../src/index";

function Index() {
   const theme = useTheme();

   const [value, setValue] = useState<string>("");

   return (
      <ScreenHolder
         footer={
            <ScreenHolder.footer
               insideBottomSafeArea
               // withNoHeader
            >
               <View gap={theme.styles.gap}>
                  <Button text="Hello" onPress={() => {}} />
                  <Button.secondary text="Hello" onPress={() => {}} />
                  <Button.destructive text="Hello" onPress={() => {}} />
                  <Button.text text="Hello" isSmall="center" onPress={() => {}} />
               </View>
            </ScreenHolder.footer>
         }
         // bottomSpace={theme.styles.space * 2}
         // keepFooterOnKeyboardOpened
         // withNoHeader
      >
         <Stack.Screen
            options={
               {
                  // headerShown: false,
               }
            }
         />

         <View gap={theme.styles.gap}>
            <View.box>
               <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, officiis.</Text>
            </View.box>

            <View isRow>
               <Animate.View
                  width={100}
                  height={100}
                  backgroundColor={"red"}
                  initialBackgroundColor={"red"}
                  whileTapBackgroundColor={"blue"}
               />
            </View>

            <Image name="logo" />
            <Image.profileImage letters="Kv" />
            <Image.profileImage name="logo" />

            <View isRow gap={theme.styles.gap}>
               <InputField.code />
               <InputField.code />
               <InputField.code />
               <InputField.code />
            </View>

            <InputField placeholder="Hello" value={value} onChange={setValue} />
            <InputField.email />
            <InputField.password />
            <InputField placeholder="Hello" prefix="+359" />
            <InputField placeholder="Hello" suffix="EUR" />
         </View>
      </ScreenHolder>
   );
}

export default memo(Index);
