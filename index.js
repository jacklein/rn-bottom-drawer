import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  View,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class BottomDrawer extends Component{
  constructor(props){
    super(props);

    // config variables
    this.TOGGLE_THRESHOLD = this.props.containerHeight / 11;
    this.UP_POSITION = { 
      x: 0, 
      y: SCREEN_HEIGHT - (this.props.containerHeight + this.props.offset) 
    };
    this.DOWN_POSITION = { 
      x: 0,
      y: this.UP_POSITION.y + (this.props.downDisplay || (this.props.containerHeight / 1.5)) 
    };

    this.state = { currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION };

    this.position = new Animated.ValueXY(this.state.currentPosition);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (this.swipeInBounds(gesture)) {
          this.position.setValue({ y: this.state.currentPosition.y + gesture.dy });
        } else {
          // user swiping up more than the drawer's height
          // ease lightly up
          this.position.setValue({ y: this.UP_POSITION.y - this.calculateEase(gesture) });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        const { currentPosition } = this.state;
        if (gesture.dy > this.TOGGLE_THRESHOLD && currentPosition === this.UP_POSITION) {
          this.transitionTo(this.DOWN_POSITION);
        } else if (gesture.dy < -this.TOGGLE_THRESHOLD && currentPosition === this.DOWN_POSITION) {
          this.transitionTo(this.UP_POSITION);
        } else {
          this.resetPosition();
        }
      }
    });
  }

  // returns true if the swipe is within the height of the drawer
  swipeInBounds(gesture) {
    return this.state.currentPosition.y + gesture.dy > this.UP_POSITION.y;
  }

  // user can only swipe up so far before ease stops
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

  render() {
    return (
      <Animated.View 
        style={[styles.animationContainer, this.position.getLayout()]}
        {...this._panResponder.panHandlers}
      >
        {this.props.renderContent()}

        <View 
          style={[styles.bottomPadding, { backgroundColor: this.props.backgroundColor}]}
        />
      </Animated.View>
    )
  }
}

BottomDrawer.defaultProps = {
  renderContent: () => <View/>,
  containerHeight: 0,
  offset: 0,
  startUp: true,
  backgroundColor: 'white'
};

BottomDrawer.propTypes = {
  renderContent: PropTypes.func,
  containerHeight: PropTypes.number,
  offset: PropTypes.number,
  startUp: PropTypes.bool,
  downDisplay: PropTypes.number,
  backgroundColor: PropTypes.string
};

const styles = {
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
}

export default BottomDrawer;