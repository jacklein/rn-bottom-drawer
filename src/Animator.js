import React, { Component } from 'react';
import {
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native';
import { DOWN_STATE, UP_STATE } from './BottomDrawer';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Animator extends Component {
  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY(this.props.currentPosition);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.drawerState !== this.props.drawerState) {
      if (nextProps.drawerState === 0) {
        this._transitionTo(this.props.downPosition, this.props.onCollapsed);
      }
      if (nextProps.drawerState === 1) {
        this._transitionTo(this.props.upPosition, this.props.onExpanded);
      }
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          { ...this.position.getLayout(), left: 0 },
          StyleSheet.flatten([
            styles.animationContainer(this.props.containerHeight, this.props.backgroundColor),
            styles.roundedEdges(this.props.roundedEdges),
            styles.shadow(this.props.shadow)
          ])
        ]}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
      </Animated.View>
    )
  }

  _handlePanResponderMove = (e, gesture) => {
    if (this._swipeInBounds(gesture)) {
      this.position.setValue({ y: this.props.currentPosition.y + gesture.dy });
    } else {
      this.position.setValue({ y: this.props.upPosition.y - this._calculateEase(gesture) });
    }
  }

  _handlePanResponderRelease = (e, gesture) => {
    if (gesture.dy > this.props.toggleThreshold && this.props.currentPosition === this.props.upPosition) {
      this._transitionTo(this.props.downPosition, this.props.onCollapsed);
      this.props.onDrawerStateSet(DOWN_STATE);
    } else if (gesture.dy < -this.props.toggleThreshold && this.props.currentPosition === this.props.downPosition) {
      this._transitionTo(this.props.upPosition, this.props.onExpanded);
      this.props.onDrawerStateSet(UP_STATE);
    } else {
      this._resetPosition();
    }
  }

  // returns true if the swipe is within the height of the drawer.
  _swipeInBounds(gesture) {
    return this.props.currentPosition.y + gesture.dy > this.props.upPosition.y;
  }

  _calculateEase(gesture) {
    return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(SCREEN_HEIGHT));
  }

  _transitionTo(position, callback) {
    Animated.spring(this.position, {
      toValue: position
    }).start(() => this.props.onExpanded());

    this.props.setCurrentPosition(position);
    callback();
  }

  _resetPosition() {
    Animated.spring(this.position, {
      toValue: this.props.currentPosition
    }).start();
  }
}

const styles = {
  animationContainer: (height, color) => ({
    width: SCREEN_WIDTH,
    position: 'absolute',
    height: height + Math.sqrt(SCREEN_HEIGHT),
    backgroundColor: color,
  }),
  roundedEdges: rounded => {
    return rounded == true && {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    }
  },
  shadow: shadow => {
    return shadow == true && {
      shadowColor: '#CECDCD',
      shadowRadius: 3,
      shadowOpacity: 5,
    }
  },
}