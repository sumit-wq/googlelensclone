import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import ImageCropper from '../../components/imageCropper';
import LensScreen from './lensSearchModal';
import { normalize } from '../../utils/normalizer';

interface RouteParams {
  imageData: string;
}

interface CropData {
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_LENS_HEIGHT = SCREEN_HEIGHT * 0.3;
const INITIAL_UPPER_HEIGHT = SCREEN_HEIGHT * 0.8;

const LensSearchScreen: React.FC<{ route: { params: RouteParams } }> = ({
  route,
}) => {
  const navigation = useNavigation();
  const { imageData } = route.params;
  const [croppedImage, setCroppedImage] = useState<CropData | null>(null);
  const [isLensExpanded, setIsLensExpanded] = useState(false);
  
  const upperContentHeight = useRef(new Animated.Value(INITIAL_UPPER_HEIGHT)).current;

  const handleLensExpand = useCallback((expanded: boolean) => {
    setIsLensExpanded(expanded);
    
    Animated.timing(upperContentHeight, {
      toValue: expanded ? 0 : INITIAL_UPPER_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [upperContentHeight]);

  const handleCropComplete = useCallback((cropData: CropData) => {
    console.log('Crop data:', cropData);
    setCroppedImage(cropData);
  }, []);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <Animated.View
        style={[
          styles.upperContent,
          {
            height: upperContentHeight,
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerLeft}
              onPress={handleBack}
            >
              <Icon name="arrow-left" size={normalize(32)} color="#FFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Google Lens</Text>
            
            <TouchableOpacity style={styles.headerRight}>
              <Icon name="dots-vertical" size={normalize(32)} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cropperContainer}>
            <ImageCropper 
              imageData={imageData}
              onCropComplete={handleCropComplete} aspectRatio={undefined}            />
          </View>
        </SafeAreaView>
      </Animated.View>
      
      <LensScreen
        imageUri={croppedImage?.uri ?? imageData}
        onExpandChange={handleLensExpand}
        initialHeight={INITIAL_LENS_HEIGHT}
        style={[
          styles.lensScreen,
          { zIndex: isLensExpanded ? 2 : 1 }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  upperContent: {
    backgroundColor: '#000',
    position: 'relative',
    borderBottomLeftRadius: normalize(16),
    borderBottomRightRadius: normalize(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: 12,
    marginTop: normalize(24),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
    zIndex:99
  },
  headerLeft: {
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: normalize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cropperContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  lensScreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
});

export default LensSearchScreen;