import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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

export default styles;