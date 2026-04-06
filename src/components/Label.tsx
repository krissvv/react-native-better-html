import { memo } from "react";
import { useTheme } from "react-better-core";

import Text from "./Text";
import View from "./View";

export type LabelProps = {
   text?: string;
   required?: boolean;
   isError?: boolean;
};

function Label({ text, required, isError }: LabelProps) {
   const theme = useTheme();

   return (
      <View isRow alignItems="center" gap={2}>
         {text && (
            <Text fontSize={14} color={isError ? theme.colors.error : theme.colors.textSecondary}>
               {text}
            </Text>
         )}

         {required && <Text color={theme.colors.error}>*</Text>}
      </View>
   );
}

export default memo(Label);
