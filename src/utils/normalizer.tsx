import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const baseWidth = 360;
const baseHeight = 800;

const normalize = (size: number): number => {
  const scaleWidth = screenWidth / baseWidth;
  const scaleHeight = screenHeight / baseHeight;
  const scale = Math.min(scaleWidth, scaleHeight);

  const newSize = size * scale;

  if (Platform.OS === 'android' && PixelRatio.getFontScale() < 1) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};


export {normalize, screenHeight};
