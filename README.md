# Bottom drawer for React Native

<p align="center">
  <img src="https://github.com/jacklein/rn-bottom-drawer/blob/master/demo.gif" alt="Demo" width="300" />
</p>

## Content

- [Installation](#installation)
- [Usage example](#usage-example)
- [Configuration](#configuration)
- [Questions?](#questions)

## Installation

Install `rn-bottom-drawer`.

```
npm install rn-bottom-drawer --save
```

## Usage Example

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomDrawer from 'rn-bottom-drawer';

const TAB_BAR_HEIGHT = 49;

export default class App extends React.Component {
  renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.text}>Get directions to your location</Text>
      </View>
    )
  }

  render() {
    return (
      <BottomDrawer
        renderContent={this.renderContent}
        containerHeight={100}
        offset={TAB_BAR_HEIGHT}
        startingPosition='up'
      />
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: 100,
    backgroundColor: 'white',
  }
});

```

## Configuration

| prop | type | default | description |
| ---- | ---- | ----| ---- |
| renderContent | function | () => <View /> | A callback function that returns the content that goes inside the drawer |
| containerHeight | number | 0 | The height of your parent View. This is used to calculate the drawer's position. You must also declare the same height within the parent View's style | 
| offset | number | 0 | If your app uses tab navigation or a header, **offset** equals their combined heights. In the demo gif, the offset is the header + tab heights so the drawer renders correctly within the map view |
| startingPosition | string | 'up' | Either 'up' or 'down', the starting position for the drawer |

### Questions?
Feel free to contact me at [jackdillklein@gmail.com](mailto:jackdillklein@gmail.com) or [create an issue](https://github.com/jacklein/rn-bottom-drawer/issues/new)