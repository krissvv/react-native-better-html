import { memo, useMemo } from "react";
import { Text as NativeText, TextProps as NativeTextProps, TextStyle as NativeTextStyle } from "react-native";
import { OmitProps, useTheme } from "react-better-core";

import { ComponentStyle } from "../types/components";

export type TextProps = {} & OmitProps<NativeTextProps, "style"> & ComponentStyle<NativeTextStyle>;

type TextComponentType = {
   (props: TextProps): React.ReactElement;
   title: (props: TextProps) => React.ReactElement;
   subtitle: (props: TextProps) => React.ReactElement;
   body: (props: TextProps) => React.ReactElement;
   caption: (props: TextProps) => React.ReactElement;
   unknown: (props: TextProps) => React.ReactElement;
};

const TextComponent: TextComponentType = function Text({ selectionColor, children, ...props }) {
   const theme = useTheme();

   const style = useMemo<NativeTextStyle>(
      () => ({
         fontSize: 16,
         color: theme.colors.textPrimary,
         ...props,
      }),
      [theme, props],
   );

   return (
      <NativeText selectionColor={selectionColor ?? theme.colors.primary} style={style} {...props}>
         {children}
      </NativeText>
   );
};

TextComponent.title = function Title(props) {
   return <TextComponent fontSize={32} fontWeight={700} {...props} />;
} as TextComponentType[`title`];

TextComponent.subtitle = function Subtitle(props) {
   return <TextComponent fontSize={24} fontWeight={700} {...props} />;
} as TextComponentType[`subtitle`];

TextComponent.body = function Body(props) {
   const theme = useTheme();

   return <TextComponent color={theme.colors.textSecondary} {...props} />;
} as TextComponentType[`body`];

TextComponent.caption = function Caption(props) {
   const theme = useTheme();

   return <TextComponent fontSize={14} color={theme.colors.textSecondary} {...props} />;
} as TextComponentType[`caption`];

TextComponent.unknown = function Unknown(props) {
   const theme = useTheme();

   return <TextComponent fontStyle="italic" textAlign="center" color={theme.colors.textSecondary} {...props} />;
} as TextComponentType[`unknown`];

const Text = memo(TextComponent) as any as typeof TextComponent & {
   title: typeof TextComponent.title;
   subtitle: typeof TextComponent.subtitle;
   body: typeof TextComponent.body;
   caption: typeof TextComponent.caption;
   unknown: typeof TextComponent.unknown;
};

Text.title = TextComponent.title;
Text.subtitle = TextComponent.subtitle;
Text.body = TextComponent.body;
Text.caption = TextComponent.caption;
Text.unknown = TextComponent.unknown;

export default Text;
