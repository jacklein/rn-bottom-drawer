import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import BottomDrawer from 'rn-bottom-drawer';

const CONTAINER_HEIGHT = 120;
// this example assumes you're using tab navigation and a header
const TAB_BAR_HEIGHT = 49;
const HEADER_HEIGHT = 60;

export default class App extends React.Component {
  renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.text}>Get directions to your location</Text>
        <View style={styles.buttonContainer}>
          <Button title="first button" />
          <Button title="second button" />
        </View>
      </View>
    )
  }

  render() {
    return (
      <BottomDrawer
        renderContent={this.renderContent}
        containerHeight={CONTAINER_HEIGHT}
        offset={TAB_BAR_HEIGHT + HEADER_HEIGHT}
      />
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: CONTAINER_HEIGHT,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  text: {
    paddingHorizontal: 5
  }
});
