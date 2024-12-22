import {useState, useEffect} from 'react';
import {Image, Dimensions} from 'react-native';

const useImageDimensions = imageData => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scaledWidth: 0,
    scaledHeight: 0,
    aspectRatio: 0,
    loading: true,
    error: null,
  });
  console.log('imageData0000', imageData);
  const calculateDimensions = async () => {
    try {
      if (imageData.width && imageData.height) {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        const aspectRatio = imageData.height / imageData.width;

        const maxWidth = screenWidth * 0.9;
        const scaledWidth = Math.min(maxWidth, imageData.width);
        const scaledHeight = scaledWidth * aspectRatio;
        console.log(
            'scaledWidth',
            scaledWidth,
            'scaledHeight',
            scaledHeight,
            'aspectRatio',
            aspectRatio,
            'width',
            imageData.width,
            'height',
            imageData.height,
          );
        setDimensions({
          width: imageData.width,
          height: imageData.height,
          scaledWidth,
          scaledHeight,
          aspectRatio,
          loading: false,
          error: null,
        });
      } else {
        Image.getSize(
          imageData.uri,
          (width, height) => {
            const screenWidth = Dimensions.get('window').width;
            const aspectRatio = height / width;

            const maxWidth = screenWidth * 0.9;
            const scaledWidth = Math.min(maxWidth, width);
            const scaledHeight = scaledWidth * aspectRatio;
            console.log(
              'scaledWidth',
              scaledWidth,
              'scaledHeight',
              scaledHeight,
              'aspectRatio',
              aspectRatio,
              'width',
              width,
              'height',
              height,
            );
            setDimensions({
              width,
              height,
              scaledWidth,
              scaledHeight,
              aspectRatio,
              loading: false,
              error: null,
            });
          },
          error => {
            setDimensions(prev => ({
              ...prev,
              loading: false,
              error: 'Error loading image dimensions',
            }));
            console.error('Error getting image size:', error);
          },
        );
      }
    } catch (error) {
      setDimensions(prev => ({
        ...prev,
        loading: false,
        error: 'Error calculating dimensions',
      }));
      console.error('Error in calculateDimensions:', error);
    }
  };

  useEffect(() => {
    calculateDimensions();
  }, [imageData.uri, imageData.width, imageData.height]);

  return dimensions;
};

export default useImageDimensions;
