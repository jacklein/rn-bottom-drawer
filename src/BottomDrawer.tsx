import React, { Component } from "react";
import { View, Dimensions, Animated } from "react-native";

import Animator, { DOWN_STATE, UP_STATE, ICurrentPosition } from "./Animator";
const SCREEN_HEIGHT = Dimensions.get("window").height;


type IState = {
  currentPosition: ICurrentPosition;
  currentState: number;
};


type IBottomDrawer = {
  /**
   * Height of the drawer.
   */
  containerHeight: number;

  /**
   * The amount of offset to apply to the drawer's position.
   * If the app uses a header and tab navigation, offset should equal
   * the sum of those two components' heights.
   */
  offset: number;

  /**
   * Set to true to have the drawer start in up position.
   */
  startUp: boolean;

  /**
   * How much the drawer's down display falls beneath the up display.
   * Ex: if set to 20, the down display will be 20 points underneath the up display.
   */
  downDisplay: number;

  /**
   * The background color of the drawer.
   */
  backgroundColor: string;

  /**
   * Set to true to give the top of the drawer rounded edges.
   */
  roundedEdges: boolean;

  /**
   * Set to true to give the drawer a shadow.
   */
  shadow: boolean;

  /**
   * A callback function triggered when the drawer swiped into up position
   */
  onExpanded: Function;

  /**
   * A callback function triggered when the drawer swiped into down position
   */
  onCollapsed: Function;

  /*
   * An state for changing and toggling drawer
   */
  drawerState: number;
};

const BottomDrawer: React.FC<IBottomDrawer> = ({
  offset = 0,
  startUp = true,
  backgroundColor = "#ffffff",
  roundedEdges = true,
  shadow = true,
  onExpanded = () => {},
  onCollapsed = () => {},
  drawerState = DOWN_STATE,
  ...props
}) => {
  const setCurrentPosition = (position: ICurrentPosition) => {
    setState({ ...state, currentPosition: position });
  };

  const _calculateUpPosition = (
    screenHeight: number,
    containerHeight: number,
    offset: number
  ): ICurrentPosition => {
    return {
      x: 0,
      y: screenHeight - (containerHeight + offset),
    };
  };

  const _calculateDownPosition = (
    upPosition: ICurrentPosition,
    downDisplay: number
  ) => {
    return {
      x: 0,
      y: upPosition.y + downDisplay,
    };
  };

  const setDrawerState = (currentState: number) => {
    setState({
      ...state,
      currentState: currentState,
    });
  };

  const toggleDrawerState = () => {
    setState({
      ...state,
      currentState: state.currentState === UP_STATE ? DOWN_STATE : UP_STATE,
    });
  };

  const openBottomDrawer = () => {
    setState({
      ...state,
      currentState: UP_STATE,
    });
  };

  const closeBottomDrawer = () => {
    setState({
      ...state,
      currentState: DOWN_STATE,
    });
  };

  /**
   * TOGGLE_THRESHOLD is how much the user has to swipe the drawer
   * before its position changes between up / down.
   */
  const TOGGLE_THRESHOLD = props.containerHeight / 11;
  const DOWN_DISPLAY = props.downDisplay || props.containerHeight / 1.5;

  /**
   * UP_POSITION and DOWN_POSITION calculate the two (x,y) values for when
   * the drawer is swiped into up position and down position.
   */
  const UP_POSITION = _calculateUpPosition(
    SCREEN_HEIGHT,
    props.containerHeight,
    offset
  );
  const DOWN_POSITION = _calculateDownPosition(UP_POSITION, DOWN_DISPLAY);

  const [state, setState] = React.useState<IState>({
    currentPosition: startUp ? UP_POSITION : DOWN_POSITION,
    currentState: startUp ? UP_STATE : DOWN_STATE,
  });

  return (
    <Animator
      currentPosition={state.currentPosition}
      setCurrentPosition={(position: ICurrentPosition) =>
        setCurrentPosition(position)
      }
      toggleThreshold={TOGGLE_THRESHOLD}
      upPosition={UP_POSITION}
      downPosition={DOWN_POSITION}
      roundedEdges={roundedEdges}
      shadow={shadow}
      containerHeight={props.containerHeight}
      backgroundColor={backgroundColor}
      onExpanded={() => onExpanded()}
      onCollapsed={() => onCollapsed()}
      drawerState={state.currentState}
      onDrawerStateSet={(state: number) => setDrawerState(state)}
    >
      {props.children}

      <View
        style={{
          height: Math.sqrt(SCREEN_HEIGHT),
          backgroundColor: backgroundColor,
        }}
      />
    </Animator>
  );
};

export default BottomDrawer;
