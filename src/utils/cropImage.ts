import PhotoManipulator from 'react-native-photo-manipulator';
import { Alert, Dimensions } from 'react-native';
import { ImageData, CropData, Position } from '../types';

export const cropImage = async (
  imageData: ImageData,
  imageSize: { width: number; height: number },
  cropSize: { width: number; height: number },
  positionValues: Position
): Promise<{ croppedUri: string; cropData: CropData } | null> => {
  try {
    if (!PhotoManipulator) {
      throw new Error('PhotoManipulator is not initialized');
    }

    if (!imageData?.uri) {
      throw new Error('No image URI provided');
    }

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    
    const imageAspectRatio = imageSize.width / imageSize.height;
    const screenAspectRatio = screenWidth / screenHeight;

    let scaledImageWidth, scaledImageHeight;
    let offsetX = 0, offsetY = 0;

    if (imageAspectRatio > screenAspectRatio) {
      scaledImageWidth = screenWidth;
      scaledImageHeight = screenWidth / imageAspectRatio;
      offsetY = (screenHeight - scaledImageHeight) / 2;
    } else {
      scaledImageHeight = screenHeight;
      scaledImageWidth = screenHeight * imageAspectRatio;
      offsetX = (screenWidth - scaledImageWidth) / 2;
    }

    const scaleX = imageSize.width / scaledImageWidth;
    const scaleY = imageSize.height / scaledImageHeight;

    const cropData = {
      x: Math.max(0, Math.round((positionValues.x - offsetX) * scaleX)),
      y: Math.max(0, Math.round((positionValues.y - offsetY) * scaleY)),
      width: Math.min(Math.round(cropSize.width * scaleX), imageSize.width),
      height: Math.min(Math.round(cropSize.height * scaleY), imageSize.height),
    };

    const croppedUri = await PhotoManipulator.crop(imageData.uri, cropData);

    if (!croppedUri) {
      throw new Error('Failed to get cropped image URI');
    }

    return { croppedUri, cropData };
  } catch (error) {
    console.error('Error cropping image:', error);
    Alert.alert('Error', 'Failed to crop image. Please try again.');
    return null;
  }
};