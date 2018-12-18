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
    this.CONTAINER_HEIGHT = this.props.containerHeight;
    this.TOGGLE_UP = { x: 0, y: SCREEN_HEIGHT - (this.CONTAINER_HEIGHT + this.props.offset) };
    this.TOGGLE_DOWN = { x: 0, y: this.TOGGLE_UP.y + this.CONTAINER_HEIGHT / 1.5 }
    this.TOGGLE_THRESHOLD = this.CONTAINER_HEIGHT / 11;

    this.state = { currentToggle: this.props.startingPosition === 'up' ? this.TOGGLE_UP : this.TOGGLE_DOWN };

    this.position = new Animated.ValueXY(this.state.currentToggle);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (this.restrictSwipe(gesture)) {
          this.position.setValue({ y: this.state.currentToggle.y + gesture.dy });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dy > this.TOGGLE_THRESHOLD && this.state.currentToggle === this.TOGGLE_UP) {
          this.toggle(this.TOGGLE_DOWN);
        } else if (gesture.dy < -this.TOGGLE_THRESHOLD && this.state.currentToggle === this.TOGGLE_DOWN) {
          this.toggle(this.TOGGLE_UP);
        } else {
          this.resetPosition();
        }
      }
    });
  }

  // can't drag content up more than its height
  restrictSwipe(gesture) {
    return (this.state.currentToggle.y + gesture.dy) > (SCREEN_HEIGHT - (this.CONTAINER_HEIGHT + this.props.offset));
  }

  toggle(direction) {
    Animated.spring(this.position, {
      toValue: direction
    }).start()
    this.setState({ currentToggle: direction })
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: this.state.currentToggle
    }).start()
  }

  render() {
    return (
      <Animated.View 
        style={[styles.animationContainer, this.position.getLayout()]}
        {...this._panResponder.panHandlers}
      >
        {this.props.renderContent()}
      </Animated.View>
    )
  }
}

BottomDrawer.defaultProps = {
  renderContent: () => <View/>,
  containerHeight: 0,
  offset: 0,
  startingPosition: 'yes'
};

BottomDrawer.propTypes = {
  renderContent: PropTypes.func,
  containerHeight: PropTypes.number,
  offset: PropTypes.number,
  startingPosition: PropTypes.string
};

const styles = {
  animationContainer: {
    width: SCREEN_WIDTH,
    position: 'absolute',
    left: 0,
    right: 0,
    shadowColor: '#CECDCD',
    shadowRadius: 3,
    shadowOpacity: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
}

export default BottomDrawer;