import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
} from 'react-native';

import Animator from './Animator';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class BottomDrawer extends Component{
  static propTypes = {
    /**
     * Height of the drawer.
     */
    containerHeight: PropTypes.number.isRequired,

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
     * The background color of the drawer.
     */
    backgroundColor: PropTypes.string,

    /**
     * Set to true to give the top of the drawer rounded edges.
     */
    roundedEdges: PropTypes.bool,

    /**
     * Set to true to give the drawer a shadow.
     */
    shadow: PropTypes.bool,

    /**
     * A callback function triggered when the drawer swiped into up position
     */
    onExpanded: PropTypes.func,

    /**
     * A callback function triggered when the drawer swiped into down position
     */
    onCollapsed: PropTypes.func,

    /**
     * Set bottom left border raidus
     */
    borderBottomLeftRadius: PropTypes.number,

    /**
     * Set bottom right border raidus
     */
    borderBottomRightRadius: PropTypes.number,

    /**
     * Set border raidus
     */
    borderRadius: PropTypes.number,

    /**
     * Set top left border raidus
     */
    borderTopLeftRadius: PropTypes.number,

    /**
     * Set top right border raidus
     */
    borderTopRightRadius: PropTypes.number,

  }

  static defaultProps = {
    offset: 0,
    startUp: true,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    roundedEdges: true,
    shadow: true,
    onExpanded: () => {},
    onCollapsed: () => {}
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
    this.UP_POSITION = this._calculateUpPosition(SCREEN_HEIGHT, this.props.containerHeight, this.props.offset)
    this.DOWN_POSITION = this._calculateDownPosition(this.UP_POSITION, this.DOWN_DISPLAY)

    this.state = { currentPosition: this.props.startUp ? this.UP_POSITION : this.DOWN_POSITION };
  }

  render() {
    return (
        <Animator
            currentPosition = {this.state.currentPosition}
            setCurrentPosition = {(position) => this.setCurrentPosition(position)}
            toggleThreshold = {this.TOGGLE_THRESHOLD}
            upPosition = {this.UP_POSITION}
            downPosition = {this.DOWN_POSITION}
            roundedEdges = {this.props.roundedEdges}
            shadow = {this.props.shadow}
            containerHeight = {this.props.containerHeight}
            backgroundColor = {this.props.backgroundColor}
            onExpanded = {() => this.props.onExpanded()}
            onCollapsed = {() => this.props.onCollapsed()}
        >
          {this.props.children}

          <View style={{height: Math.sqrt(SCREEN_HEIGHT),
            backgroundColor: this.props.backgroundColor,
            borderRadius: this.props.borderRadius,
            borderBottomLeftRadius: this.props.borderBottomLeftRadius,
            borderBottomRightRadius: this.props.borderBottomRightRadius,
            borderTopLeftRadius: this.props.borderTopLeftRadius,
            borderTopRightRadius: this.props.borderTopRightRadius,
          }}

          />
        </Animator>
    )
  }

  setCurrentPosition(position) {
    this.setState({ currentPosition: position })
  }

  _calculateUpPosition(screenHeight, containerHeight, offset) {
    return {
      x: 0,
      y: screenHeight - (containerHeight + offset)
    }
  }

  _calculateDownPosition(upPosition, downDisplay) {
    return {
      x: 0,
      y: upPosition.y + downDisplay
    };
  }
}
