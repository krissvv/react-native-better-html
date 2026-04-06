import { memo, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";

import {
   Animate,
   Button,
   Icon,
   Image,
   InputField,
   ListItem,
   ScreenHolder,
   Switch,
   Text,
   useAlertControls,
   useForm,
   useTheme,
   View,
   CheckBox,
   Label,
} from "../../src/index";

function Index() {
   const theme = useTheme();
   const alertControls = useAlertControls();

   const [value, setValue] = useState<string>("");

   const form = useForm({
      defaultValues: {
         first: "",
         second: "",
         third: "",
         date: "",
         switch: false,
         checkBox: false,
      },
      requiredFields: ["first"],
      onSubmit: (values) => {
         console.log(values);
      },
   });

   return (
      <ScreenHolder
         // footer={
         //    <ScreenHolder.footer
         //       insideBottomSafeArea
         //       // withNoHeader
         //    >
         //       <View gap={theme.styles.gap}>
         //          <Button text="Hello" onPress={() => {}} icon="XMark" />
         //          <Button.secondary text="Hello" onPress={() => {}} />
         //          <Button.destructive text="Hello" onPress={() => {}} />
         //          <Button.text text="Hello" isSmall="center" onPress={() => {}} />
         //       </View>
         //    </ScreenHolder.footer>
         // }
         insideBottomSafeArea
         // bottomSpace={theme.styles.space * 2}
         // keepFooterOnKeyboardOpened
         // withNoHeader
         // noScroll
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

            <Switch {...form.getSwitchProps("switch")} />

            <CheckBox {...form.getCheckBoxProps("checkBox")} />
            <CheckBox text="This is a checkbox with text" required {...form.getCheckBoxProps("checkBox")} />
            <CheckBox
               text={
                  <View isRow columnGap={5} flexWrap="wrap">
                     <Text>I agree with</Text>
                     <View pressType="opacity">
                        <Text fontWeight={700} textDecorationLine="underline">
                           Terms & Conditions
                        </Text>
                     </View>
                     <Text>and</Text>
                     <View pressType="opacity">
                        <Text fontWeight={700} textDecorationLine="underline">
                           Privacy Policy
                        </Text>
                     </View>
                     <Label required />
                  </View>
               }
               {...form.getCheckBoxProps("checkBox")}
            />

            <ListItem
               title="awdawd"
               description="aiwdv aywjdv ajwyvd"
               icon="XMark"
               iconIOS="xmark"
               rightElement="arrow"
               rightValue="awdaw"
               insideScreenHolder
               onPress={() => {}}
            />

            <ListItem
               title="awdawd"
               description="aiwdv aywjdv ajwyvd"
               icon="XMark"
               iconIOS="xmark"
               rightElement="switch"
               insideScreenHolder
            />

            <ListItem
               title="awdawd"
               description="aiwdv aywjdv ajwyvd"
               icon="XMark"
               iconIOS="xmark"
               rightElement="checkBox"
               insideScreenHolder
            />

            <View isRow>
               <Animate.View
                  width={100}
                  height={100}
                  backgroundColor={"red"}
                  initialBackgroundColor={"red"}
                  whileTapBackgroundColor={"blue"}
               />
            </View>

            <View isRow>
               <Button
                  text="Inf Ale"
                  onPress={() =>
                     alertControls.createAlert({
                        type: "info",
                        message: "This is an info alert",
                     })
                  }
               />
               <Button
                  text="Succ Ale"
                  onPress={() =>
                     alertControls.createAlert({
                        type: "success",
                        message: "This is an success alert",
                     })
                  }
               />
               <Button
                  text="War Ale"
                  onPress={() =>
                     alertControls.createAlert({
                        type: "warning",
                        message: "This is an warning alert awd awdawd awdawd awdawd awdawdawd awdawd",
                     })
                  }
               />
               <Button
                  text="Err Ale"
                  onPress={() =>
                     alertControls.createAlert({
                        type: "error",
                        message: "This is an error alert",
                     })
                  }
               />
            </View>

            <Icon name="XMark" nameIOS="xmark" size={20} onPress={() => console.log("Awd")} />

            <Image name="logo" />
            <Image.profileImage letters="Kv" />
            <Image.profileImage name="logo" />

            <View isRow gap={theme.styles.gap}>
               <InputField.code />
               <InputField.code />
               <InputField.code />
               <InputField.code />
            </View>

            <InputField
               label="Editable NOT"
               editable={false}
               onPress={() => console.log(new Date().toString())}
            />

            <InputField
               label="Hello"
               placeholder="Hello"
               errorMessage="lorem inpiusn auydev qduy vdajywvd ja"
               isError
               value={value}
               onChange={setValue}
            />
            <InputField.email />
            <InputField.password />
            <InputField.search />
            <InputField
               leftIcon="XMark"
               leftIconIOS="xmark"
               rightIcon="check"
               label="Just that"
               infoMessage="lorem inpiusn auydev ajwdv ad"
               placeholder="Hello"
               prefix="+359"
               // onPressPrefix={() => console.log(new Date().toString())}
            />
            <InputField
               placeholder="Hello"
               suffix="EUR"
               onPressSuffix={() => console.log(new Date().toString())}
            />

            <InputField
               placeholder="Hello"
               suffix={
                  Platform.OS === "ios" ? <Icon name="chevronRight" nameIOS="chevron.right" /> : undefined
               }
               editable={false}
               onPress={() => console.log(new Date().toString())}
               onPressSuffix={() => console.log(new Date().toString())}
            />

            <InputField type="date" label="Date" {...form.getInputFieldProps("date")} />
            <InputField type="time" label="Time" />

            <InputField type="date" label="Date" iOSDateTimeFullSize />
            <InputField type="time" label="Time" iOSDateTimeFullSize />

            <InputField label="First" placeholder="First" {...form.getInputFieldProps("first")} />
            <InputField label="Second" placeholder="Second" {...form.getInputFieldProps("second")} />
            <InputField label="Third" placeholder="Third" {...form.getInputFieldProps("third")} />
         </View>
      </ScreenHolder>
   );
}

export default memo(Index);
