import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import BottomDrawer from 'rn-bottom-drawer';

// this example assumes you're using a header and a tab bar
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
        containerHeight={100}
        offset={TAB_BAR_HEIGHT + HEADER_HEIGHT}
        onExpanded = {() => {console.log('expanded')}}
        onCollapsed = {() => {console.log('collapsed')}}
      >
        {this.renderContent()}
      </BottomDrawer>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  text: {
    paddingHorizontal: 5
  }
});
