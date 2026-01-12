import { memo, useMemo } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Motion, PropsTransforms, EaseFunction, MotionTransition } from "@legendapp/motion";

import { ComponentStyle } from "../types/components";

import { useComponentPropsGrouper } from "../utils/hooks";

export const defaultTransitionDuration = 0.15 * 1000;

type ComponentStyleProps<Style extends ViewStyle = ViewStyle> = Omit<
   ComponentStyle<Style>,
   "transformOrigin"
>;
type AnimationStyleProps<Style extends ViewStyle = ViewStyle> = ComponentStyle<Style> & PropsTransforms;

type InitialComponentStyle<Style extends ViewStyle = ViewStyle> = {
   [CSSProperty in keyof AnimationStyleProps<Style> as `initial${Capitalize<
      CSSProperty & string
   >}`]: AnimationStyleProps<Style>[CSSProperty];
};
type animateComponentStyle<Style extends ViewStyle = ViewStyle> = {
   [CSSProperty in keyof AnimationStyleProps<Style> as `animate${Capitalize<
      CSSProperty & string
   >}`]: AnimationStyleProps<Style>[CSSProperty];
};
type whileTapComponentStyle<Style extends ViewStyle = ViewStyle> = {
   [CSSProperty in keyof AnimationStyleProps<Style> as `whileTap${Capitalize<
      CSSProperty & string
   >}`]: AnimationStyleProps<Style>[CSSProperty];
};

type TransitionProps = {
   transitionLoop?: number;
} & (
   | {
        transitionType?: "tween" | "timing" | undefined;
        transitionEase?: EaseFunction | ((value: number) => number) | undefined;
        transitionEasing?: EaseFunction | ((value: number) => number) | undefined;
        transitionDuration?: number | undefined;
        transitionDelay?: number | undefined;
     }
   | {
        transitionType: "spring";
        transitionFriction?: number;
        transitionTension?: number;
        transitionSpeed?: number;
        transitionBounciness?: number;
        transitionStiffness?: number;
        transitionDamping?: number;
        transitionMass?: number;
        transitionOvershootClamping?: boolean | undefined;
        transitionRestDisplacementThreshold?: number | undefined;
        transitionRestSpeedThreshold?: number | undefined;
        transitionVelocity?:
           | number
           | {
                x: number;
                y: number;
             }
           | undefined;
     }
);

type AnimateCommonProps = {
   transformOriginX?: number;
   transformOriginY?: number;
   children?: React.ReactNode;
} & TransitionProps;

export type AnimateViewProps = {} & AnimateCommonProps &
   ComponentStyleProps &
   InitialComponentStyle &
   animateComponentStyle &
   whileTapComponentStyle;

export type AnimateTextProps = {} & AnimateCommonProps &
   ComponentStyleProps<TextStyle> &
   InitialComponentStyle<TextStyle> &
   animateComponentStyle<TextStyle> &
   whileTapComponentStyle<TextStyle>;

const Animate = {
   View: memo(function View({ transformOriginX, transformOriginY, children, ...props }: AnimateViewProps) {
      const initialProps = useComponentPropsGrouper(props, "initial");
      const animateProps = useComponentPropsGrouper(props, "animate");
      const whileTapProps = useComponentPropsGrouper(props, "whileTap");
      const transitionProps = useComponentPropsGrouper(props, "transition");

      const transition = useMemo<MotionTransition>(
         () => ({
            type: "timing",
            duration: defaultTransitionDuration,
            ...(transitionProps.withPrefixStyle as any),
         }),
         [transitionProps.withPrefixStyle],
      );
      const transformOrigin = useMemo(
         () =>
            transformOriginX !== undefined || transformOriginY !== undefined
               ? {
                    x: transformOriginX ?? 0,
                    y: transformOriginY ?? 0,
                 }
               : undefined,
         [transformOriginX, transformOriginY],
      );

      const content = (
         <Motion.View
            style={initialProps.style}
            initial={initialProps.withPrefixStyle}
            animate={animateProps.withPrefixStyle}
            transition={transition}
            whileTap={whileTapProps.withPrefixStyle}
            transformOrigin={transformOrigin}
         >
            {children}
         </Motion.View>
      );

      return Object.keys(whileTapProps.withPrefixStyle).length > 0 ? (
         <Motion.Pressable>{content}</Motion.Pressable>
      ) : (
         content
      );
   }),
   Text: memo(function Text({ transformOriginX, transformOriginY, children, ...props }: AnimateTextProps) {
      const initialProps = useComponentPropsGrouper(props, "initial");
      const animateProps = useComponentPropsGrouper(props, "animate");
      const whileTapProps = useComponentPropsGrouper(props, "whileTap");
      const transitionProps = useComponentPropsGrouper(props, "transition");

      const transition = useMemo<MotionTransition>(
         () => ({
            type: "timing",
            duration: defaultTransitionDuration,
            ...(transitionProps.withPrefixStyle as any),
         }),
         [transitionProps.withPrefixStyle],
      );
      const transformOrigin = useMemo(
         () =>
            transformOriginX !== undefined || transformOriginY !== undefined
               ? {
                    x: transformOriginX ?? 0,
                    y: transformOriginY ?? 0,
                 }
               : undefined,
         [transformOriginX, transformOriginY],
      );

      const content = (
         <Motion.Text
            style={initialProps.style}
            initial={initialProps.withPrefixStyle}
            animate={animateProps.withPrefixStyle}
            transition={transition}
            whileTap={whileTapProps.withPrefixStyle}
            transformOrigin={transformOrigin}
         >
            {children}
         </Motion.Text>
      );

      return Object.keys(whileTapProps.withPrefixStyle).length > 0 ? (
         <Motion.Pressable>{content}</Motion.Pressable>
      ) : (
         content
      );
   }),
};

export default Animate;
