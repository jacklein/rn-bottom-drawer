import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  View,
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class BottomDrawer extends Component{
  static propTypes = {
    /**
     * User defined callback that returns the content that goes in the drawer.
     */
    renderContent: PropTypes.func,

    /**
     * Height of the drawer. 
     * Should be the same height as the content inside.
     */
    containerHeight: PropTypes.number,

    /**
     * The amount of offset to apply to the drawer's position.
     * If the app uses a header and tab navigation, offset should equal 
     * the sum of those two components' heights.
     */
    offset: PropTypes.number,

    /**
     * Set to true to have the drawer start in up position.
     */
    startUp: PropTypes.bool,

    /**
     * How much the drawer's down display falls beneath the up display. 
     * Ex: if set to 20, the down display will be 20 points underneath the up display.
     */
    downDisplay: PropTypes.number,

    /**
     * The color of the drawer's bottom padding.
     * Should be the same color as the background color of the content inside. 
     */
    backgroundColor: PropTypes.string
  }

  static defaultProps = {
    renderContent: () => <View/>,
    containerHeight: 0,
    offset: 0,
    startUp: true,
    backgroundColor: '#ffffff'
  }

  constructor(props){
    super(props);

    /**
     * TOGGLE_THRESHOLD is how much the user has to swipe the drawer
     * before its position changes between up / down.
     */
    this.TOGGLE_THRESHOLD = this.props.containerHeight / 11;
    this.DOWN_DISPLAY = this.props.downDisplay || this.props.containerHeight / 1.5;

    /**
     * UP_POSITION and DOWN_POSITION calculate the two (x,y) values for when
     * the drawer is swiped into up position and down position.
     */
    this.UP_POSITION = { 
      x: 0, 
      y: SCREEN_HEIGHT - (this.props.containerHeight + this.props.offset) 
    };
    this.DOWN_POSITION = { 
      x: 0,
      y: this.UP_POSITION.y + this.DOWN_DISPLAY
    };

    this.state = { currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION };

    this.position = new Animated.ValueXY(this.state.currentPosition);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease
    });
  }

  render() {
    return (
      <Animated.View 
        style={[styles.animationContainer, this.position.getLayout()]}
        {...this._panResponder.panHandlers}
      >
        {this.props.renderContent()}
        <View style={[styles.bottomPadding, { backgroundColor: this.props.backgroundColor}]} />
      </Animated.View>
    )
  }

  _handlePanResponderMove = (e, gesture) => {
    if (this.swipeInBounds(gesture)) {
      this.position.setValue({ y: this.state.currentPosition.y + gesture.dy });
    } else {
      this.position.setValue({ y: this.UP_POSITION.y - this.calculateEase(gesture) });
    }
  }

  _handlePanResponderRelease = (e, gesture) => {
    const { currentPosition } = this.state;
    if (gesture.dy > this.TOGGLE_THRESHOLD && currentPosition === this.UP_POSITION) {
      this.transitionTo(this.DOWN_POSITION);
    } else if (gesture.dy < -this.TOGGLE_THRESHOLD && currentPosition === this.DOWN_POSITION) {
      this.transitionTo(this.UP_POSITION);
    } else {
      this.resetPosition();
    }
  }

  // returns true if the swipe is within the height of the drawer.
  swipeInBounds(gesture) {
    return this.state.currentPosition.y + gesture.dy > this.UP_POSITION.y;
  }

  // when the user swipes the drawer above its height, this calculates
  // the drawer's slowing upward ease.
  calculateEase(gesture) {
    return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(SCREEN_HEIGHT));
  }

  transitionTo(position) {
    Animated.spring(this.position, {
      toValue: position
    }).start();
    this.setState({ currentPosition: position });
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: this.state.currentPosition
    }).start();
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    width: SCREEN_WIDTH,
    position: 'absolute',
    shadowColor: '#CECDCD',
    shadowRadius: 3,
    shadowOpacity: 5,
  },
  bottomPadding: {
    height: Math.sqrt(SCREEN_HEIGHT) + 1,
    marginTop: -1
  }
})