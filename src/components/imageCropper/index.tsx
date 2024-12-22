import React, { useState, useRef } from 'react';
import { View, Image, Dimensions, Animated, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import PhotoManipulator from 'react-native-photo-manipulator';
import { styles } from './styles';
import useImageDimensions from '../../hooks/useDimension';

type ImageData = {
  uri: string;
  width?: number;
  height?: number;
};

type ImageCropperProps = {
  imageData: ImageData;
  onCropComplete: (data: { croppedUri: string | null; cropData: any }) => void;
};

const ImageCropper: React.FC<ImageCropperProps> = ({ imageData, onCropComplete }) => {
  const { uri: imageUri } = imageData;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const {
    width,
    height,
    scaledWidth,
    scaledHeight,
    aspectRatio,
    loading,
    error
  } = useImageDimensions(imageData);
  

  const MIN_CROP_SIZE = 100;
  const MAX_CROP_WIDTH = screenWidth * 0.8;
  const MAX_CROP_HEIGHT = screenHeight * 0.6;

  const initialWidth = screenWidth * 0.8;
  const initialHeight = screenHeight * 0.6;

  const [cropBox, setCropBox] = useState({
    x: (screenWidth - initialWidth) / 2,
    y: (screenHeight - initialHeight) / 2,
    width: initialWidth,
    height: initialHeight,
  });

  const pan = useRef(new Animated.ValueXY()).current;

  const moveCropBox = (gestureState: any) => {
    setCropBox(prevState => {
      const newX = prevState.x + gestureState.translationX;
      const newY = prevState.y + gestureState.translationY;

      const adjustedX = Math.min(Math.max(newX, 0), screenWidth - prevState.width);
      const adjustedY = Math.min(Math.max(newY, 0), screenHeight - prevState.height);

      return { ...prevState, x: adjustedX, y: adjustedY };
    });

    triggerCrop();
  };

  const resizeCropBox = (gestureState: any, corner: string) => {
    setCropBox(prevState => {
      let newWidth = prevState.width;
      let newHeight = prevState.height;
      let newX = prevState.x;
      let newY = prevState.y;

      const scaleFactor = 7;
      const translationX = gestureState.translationX / scaleFactor;
      const translationY = gestureState.translationY / scaleFactor;

      if (corner === 'top-left') {
        newWidth = prevState.width - translationX;
        newHeight = prevState.height - translationY;
        newX = prevState.x + translationX;
        newY = prevState.y + translationY;
      } else if (corner === 'top-right') {
        newWidth = prevState.width + translationX;
        newHeight = prevState.height - translationY;
        newY = prevState.y + translationY;
      } else if (corner === 'bottom-left') {
        newWidth = prevState.width - translationX;
        newHeight = prevState.height + translationY;
        newX = prevState.x + translationX;
      } else if (corner === 'bottom-right') {
        newWidth = prevState.width + translationX;
        newHeight = prevState.height + translationY;
      }

      const adjustedWidth = Math.min(Math.max(newWidth, MIN_CROP_SIZE), MAX_CROP_WIDTH);
      const adjustedHeight = Math.min(Math.max(newHeight, MIN_CROP_SIZE), MAX_CROP_HEIGHT);

      const adjustedX = Math.min(Math.max(newX, 0), screenWidth - adjustedWidth);
      const adjustedY = Math.min(Math.max(newY, 0), screenHeight - adjustedHeight);

      return { ...prevState, width: adjustedWidth, height: adjustedHeight, x: adjustedX, y: adjustedY };
    });

    triggerCrop();
  };

  const triggerCrop = async () => {
    try {
      const { x, y, width, height } = cropBox;
      
      if (!imageData.width || !imageData.height || !scaledWidth || !scaledHeight) {
        console.log('Missing required dimensions');
        return;
      }
      
      const scaleX = imageData.width / scaledWidth;
      const scaleY = imageData.height / scaledHeight;

      if (isNaN(scaleX) || isNaN(scaleY)) {
        console.log('Invalid scale factors');
        return;
      }
      
      const cropData = {
        x: Math.max(0, Math.round(x * scaleX)),
        y: Math.max(0, Math.round(y * scaleY)),
        width: Math.min(imageData.width, Math.round(width * scaleX)),
        height: Math.min(imageData.height, Math.round(height * scaleY))
      };
      
      if (cropData.width <= 0 || cropData.height <= 0) {
        console.log('Invalid crop dimensions');
        return;
      }
    
      
      const croppedImage = await PhotoManipulator.crop(imageUri, cropData);
      console.log('About to crop with data uri:', croppedImage);
      onCropComplete({
        uri: croppedImage,
        cropData: cropData,
      });
    } catch (error) {
      console.log('Error details:', error);
      console.log('Failed crop data:', cropBox);
    }
  };

  const onPanHandlerStateChange = (event: any) => {
    const { state } = event.nativeEvent;
    if (state === State.END) {
      triggerCrop();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width: scaledWidth, height: scaledHeight }]}
        resizeMode="contain"
      />
      <PanGestureHandler
        onGestureEvent={(e) => moveCropBox(e.nativeEvent)}
        onHandlerStateChange={onPanHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.cropperContainer,
            {
              width: cropBox.width,
              height: cropBox.height,
              top: cropBox.y,
              left: cropBox.x,
            },
          ]}
        >

          <PanGestureHandler onGestureEvent={(e) => resizeCropBox(e.nativeEvent, 'top-left')}>
            <Animated.View style={[styles.corner, styles.topLeft]} />
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={(e) => resizeCropBox(e.nativeEvent, 'top-right')}>
            <Animated.View style={[styles.corner, styles.topRight]} />
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={(e) => resizeCropBox(e.nativeEvent, 'bottom-left')}>
            <Animated.View style={[styles.corner, styles.bottomLeft]} />
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={(e) => resizeCropBox(e.nativeEvent, 'bottom-right')}>
            <Animated.View style={[styles.corner, styles.bottomRight]} />
          </PanGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default ImageCropper;
