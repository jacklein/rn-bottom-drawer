import React from "react";
import {
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export const DOWN_STATE = 0;
export const UP_STATE = 1;

export type ICurrentPosition = {
  x: number;
  y: number;
};

type IAnimator = {
  currentPosition: ICurrentPosition;
  downPosition: ICurrentPosition;
  upPosition: ICurrentPosition;
  setCurrentPosition: (position: ICurrentPosition) => void;
  toggleThreshold: number;
  roundedEdges: boolean;
  shadow: boolean;
  containerHeight: number;
  backgroundColor: string;
  onExpanded: () => any;
  onCollapsed: () => any;
  drawerState: number;
  onDrawerStateSet: (state: number) => void;
};

const Animator: React.FC<IAnimator> = ({ ...props }) => {
  React.useEffect(() => {
    if (props.drawerState === 0) {
      _transitionTo(props.downPosition, props.onCollapsed);
    } else if (props.drawerState === 1) {
      _transitionTo(props.upPosition, props.onExpanded);
    }
  }, [props.drawerState]);

  const position = new Animated.ValueXY(props.currentPosition);

  const _handlePanResponderMove = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState
  ) => {
    if (_swipeInBounds(gesture)) {
      position.setValue({
        x: props.currentPosition.x,
        y: props.currentPosition.y + gesture.dy,
      });
    } else {
      position.setValue({
        x: props.currentPosition.x,
        y: props.upPosition.y - _calculateEase(gesture),
      });
    }
  };

  const _handlePanResponderRelease = (
    e: GestureResponderEvent,
    gesture: PanResponderGestureState
  ) => {
    if (
      gesture.dy > props.toggleThreshold &&
      props.currentPosition === props.upPosition
    ) {
      _transitionTo(props.downPosition, props.onCollapsed);
      props.onDrawerStateSet(DOWN_STATE);
    } else if (
      gesture.dy < -props.toggleThreshold &&
      props.currentPosition === props.downPosition
    ) {
      _transitionTo(props.upPosition, props.onExpanded);
      props.onDrawerStateSet(UP_STATE);
    } else {
      _resetPosition();
    }
  };

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: _handlePanResponderMove,
    onPanResponderRelease: _handlePanResponderRelease,
  });

  // returns true if the swipe is wi the height of the drawer.
  const _swipeInBounds = (gesture: PanResponderGestureState) => {
    return props.currentPosition.y + gesture.dy > props.upPosition.y;
  };

  const _calculateEase = (gesture: PanResponderGestureState) => {
    return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(SCREEN_HEIGHT));
  };

  const _transitionTo = (position: ICurrentPosition, callback: () => any) => {
    // @ts-ignore
    Animated.spring(new Animated.ValueXY(position), {
      toValue: position,
    }).start(() => props.onExpanded());

    props.setCurrentPosition(position);
    callback();
  };

  const _resetPosition = () => {
    Animated.spring(new Animated.ValueXY(position), {
      toValue: props.currentPosition,
    }).start();
  };

  return (
    <Animated.View
      style={[
        { ...position.getLayout(), left: 0 },
        StyleSheet.flatten([
          styles.animationContainer(
            props.containerHeight,
            props.backgroundColor
          ),
          styles.roundedEdges(props.roundedEdges),
          styles.shadow(props.shadow),
        ]),
      ]}
      {..._panResponder.panHandlers}
    >
      {props.children}
    </Animated.View>
  );
};

const styles = {
  animationContainer: (height: number, color: string) => ({
    width: SCREEN_WIDTH,
    position: "absolute",
    height: height + Math.sqrt(SCREEN_HEIGHT),
    backgroundColor: color,
  }),
  roundedEdges: (rounded: boolean) => {
    return (
      rounded == true && {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }
    );
  },
  shadow: (shadow: boolean) => {
    return (
      shadow == true && {
        shadowColor: "#CECDCD",
        shadowRadius: 3,
        shadowOpacity: 5,
      }
    );
  },
};

export default Animator;
