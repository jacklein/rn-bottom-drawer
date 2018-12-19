# Bottom drawer for React Native

<p align="center">
  <img src="demo.gif" alt="Demo gif" width="300" />
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

const CONTAINER_HEIGHT = 100;
const TAB_BAR_HEIGHT = 49;

export default class App extends React.Component {
  renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text>Get directions to your location</Text>
      </View>
    )
  }

  render() {
    return (
      <BottomDrawer
        renderContent={this.renderContent}
        containerHeight={CONTAINER_HEIGHT}
        offset={TAB_BAR_HEIGHT}
        startingPosition='up'
      />
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: CONTAINER_HEIGHT,
    backgroundColor: 'white',
  }
});

```

## Configuration

| prop | type | default | description |
| ---- | ---- | ----| ---- |
| renderContent | function | () => {} | A callback function that returns the content that goes inside the drawer. |
| containerHeight | number | 0 | The height of your parent View. This is used to calculate the drawer's position. You must also declare the same height within the parent View's style. | 
| offset | number | 0 | If your app uses tab navigation or a header, **offset** equals their combined heights. In the demo gif, the offset is the header + tab heights so the drawer renders correctly within the map view. |
| startUp | boolean | true | If **true**, the drawer will start in up position, and if **false** it will start in down position |
| downDisplay | number | containerHeight / 1.5 | When the drawer is swiped into down position, **downDisplay** controls how far it settles below its up position. For example, if its value is 20, the drawer will settle 20 points below the up position. The default value shows 1/3 of the container (if containerHeight = 60, the default downDisplay value = **40**). |
| backgroundColor | string | 'white' | The background color of your parent View. You must also declare the same background color within the parent View's style. This prop is used for bottom padding. |

### Questions?
Feel free to contact me at [jackdillklein@gmail.com](mailto:jackdillklein@gmail.com) or [create an issue](https://github.com/jacklein/rn-bottom-drawer/issues/new)
