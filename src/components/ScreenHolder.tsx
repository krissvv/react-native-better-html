import { memo, useCallback, useMemo } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, ViewStyle } from "react-native";
import { useBooleanState, useTheme } from "react-better-core";

import { useDevice, useKeyboard } from "../utils/hooks";

import View, { ViewProps } from "./View";

export type ScreenHolderProps = {
   /** @default false */
   noScroll?: boolean;
   /** @default false */
   noSideSpace?: boolean;
   /** @default false */
   noTopSpace?: boolean;
   /** @default 1 (second) */
   refreshTimeout?: number;
   onRefresh?: () => void;
   onRefreshEnd?: () => void;
   /** @default "backgroundBase" */
   backgroundColor?: ViewProps["backgroundColor"];
   /** @default false */
   insideTopSafeArea?: boolean;
   /** @default false */
   insideBottomSafeArea?: boolean;
   /** @default 0 */
   bottomSpace?: number;
   footer?: React.ReactNode;
   /** @default false */
   keepFooterOnKeyboardOpened?: boolean;
   keyboardVerticalOffset?: number;
   /** @default false */
   withNoHeader?: boolean;
   children?: React.ReactNode;
};

type ScreenHolderComponentType = {
   (props: ScreenHolderProps): React.ReactElement;
   footer: (props: FooterProps) => React.ReactElement;
};

const ScreenHolderComponent: ScreenHolderComponentType = ({
   noScroll,
   noSideSpace,
   noTopSpace,
   refreshTimeout = 1,
   onRefresh,
   onRefreshEnd,
   backgroundColor,
   insideTopSafeArea,
   insideBottomSafeArea,
   bottomSpace = 0,
   footer,
   keepFooterOnKeyboardOpened,
   keyboardVerticalOffset,
   withNoHeader,
   children,
}) => {
   const theme = useTheme();
   const device = useDevice();
   const keyboard = useKeyboard();

   const [isRefreshing, setIsRefreshing] = useBooleanState();

   const keyboardAvoidingViewStyle = useMemo<ViewStyle>(
      () => ({
         flex: 1,
      }),
      [],
   );

   const onRefreshElement = useCallback(() => {
      setIsRefreshing.setTrue();
      onRefresh?.();

      setTimeout(() => {
         setIsRefreshing.setFalse();
         onRefreshEnd?.();
      }, refreshTimeout * 1000);
   }, [onRefresh, onRefreshEnd, refreshTimeout]);

   const content = (
      <View
         flex={1}
         paddingHorizontal={!noSideSpace ? theme.styles.space : undefined}
         paddingTop={
            (!noTopSpace ? theme.styles.gap : 0) +
            (insideTopSafeArea ? device.safeArea.afterCalculations.top : 0)
         }
         paddingBottom={
            Platform.OS === "ios" && keyboard.isOpened
               ? device.safeArea.afterCalculations.top
               : bottomSpace + (insideBottomSafeArea ? device.safeArea.afterCalculations.bottom : 0)
         }
      >
         {children}
      </View>
   );

   const withRefresh = onRefresh || onRefreshEnd;

   return (
      <View flex={1} backgroundColor={backgroundColor ?? theme.colors.backgroundBase}>
         <KeyboardAvoidingView
            style={keyboardAvoidingViewStyle}
            keyboardVerticalOffset={
               keyboardVerticalOffset ??
               (withNoHeader
                  ? Platform.OS === "ios"
                     ? 0
                     : theme.styles.gap
                  : keepFooterOnKeyboardOpened
                    ? Platform.OS === "ios"
                       ? device.safeArea.afterCalculations.bottom
                       : theme.styles.gap
                    : undefined)
            }
            behavior={Platform.OS === "ios" ? "padding" : "height"}
         >
            <View flex={1}>
               {noScroll ? (
                  content
               ) : (
                  <ScrollView
                     refreshControl={
                        withRefresh ? (
                           <RefreshControl refreshing={isRefreshing} onRefresh={onRefreshElement} />
                        ) : undefined
                     }
                  >
                     {content}
                  </ScrollView>
               )}
            </View>

            {keepFooterOnKeyboardOpened || (Platform.OS === "ios" ? !keyboard.willOpen : !keyboard.isOpened)
               ? footer && <View>{footer}</View>
               : !withNoHeader && (
                    <View
                       width="100%"
                       height={
                          device.safeArea.afterCalculations.bottom +
                          (Platform.OS === "android" ? theme.styles.gap : 0)
                       }
                    />
                 )}
         </KeyboardAvoidingView>
      </View>
   );
};

export type FooterProps = {
   /** @default false */
   noSideSpace?: boolean;
   /** @default "backgroundBase" */
   backgroundColor?: ViewProps["backgroundColor"];
   /** @default false */
   insideBottomSafeArea?: boolean;
   /** @default false */
   withNoHeader?: boolean;
   children?: React.ReactNode;
};

ScreenHolderComponent.footer = function Footer({
   noSideSpace,
   backgroundColor,
   insideBottomSafeArea,
   withNoHeader,
   children,
}) {
   const theme = useTheme();
   const device = useDevice();
   const keyboard = useKeyboard();

   return (
      <View
         backgroundColor={backgroundColor ?? theme.colors.backgroundBase}
         paddingHorizontal={!noSideSpace ? theme.styles.space : undefined}
         paddingTop={theme.styles.gap}
         paddingBottom={
            (Platform.OS === "ios" ? keyboard.willOpen : keyboard.isOpened) && withNoHeader
               ? theme.styles.gap
               : insideBottomSafeArea
                 ? device.safeArea.afterCalculations.bottom
                 : undefined
         }
      >
         {children}
      </View>
   );
} as ScreenHolderComponentType[`footer`];

const ScreenHolder = memo(ScreenHolderComponent) as any as typeof ScreenHolderComponent & {
   footer: typeof ScreenHolderComponent.footer;
};

ScreenHolder.footer = ScreenHolderComponent.footer;

export default ScreenHolder;
