import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import {Camera, FlashMode, CameraApi} from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PermissionManager} from '../../managers/permissionManager';
import {normalize} from '../../utils/normalizer';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {styles} from './styles';

const {width} = Dimensions.get('window');

type Mode = 'search' | 'translate' | 'homework';

interface ImageData {
  uri: string;
  type: string;
  source: 'camera' | 'gallery';
  width?: number;
  height?: number;
  fileName?: string;
  fileSize?: number;
}

const GoogleLensCamera = () => {
  const navigation = useNavigation();
  const cameraRef = useRef<CameraApi | null>(null);
  const [mode, setMode] = useState<Mode>('search');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const overlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await PermissionManager.checkPermission('camera');
    if (!cameraPermission) {
      const granted = await PermissionManager.requestPermission('camera');
      setHasPermission(granted);
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }

    setShowOverlay(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    overlayTimeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowOverlay(false);
      });
    }, 5000);
  }, [mode]);

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const image = await cameraRef.current.capture();
        if (image && image.uri) {
          const imageData: ImageData = {
            uri: image.uri,
            type: 'photo',
            source: 'camera',
            width: image.width,
            height: image.height,
          };

          navigation.navigate('SearchLens', {
            imageData,
          });
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleGalleryPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
        quality: 0.8,
      });

      if (result.assets && result.assets[0] && result.assets[0].uri) {
        const selectedImage = result.assets[0];
        const imageData: ImageData = {
          uri: selectedImage.uri,
          type: selectedImage.type || 'photo',
          source: 'gallery',
          width: selectedImage.width,
          height: selectedImage.height,
          fileName: selectedImage.fileName,
          fileSize: selectedImage.fileSize,
        };

        navigation.navigate('SearchLens', {
          imageData,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    fadeAnim.setValue(0);
  };

  // const getModeContent = () => {
  //   switch (mode) {
  //     case 'translate':
  //       return {
  //         icon: <Text style={styles.translateText}>文A</Text>,
  //         text: 'Point at text to translate',
  //         overlayStyle: styles.fullOverlay,
  //       };
  //     case 'homework':
  //       return {
  //         icon: <Icon name="school" size={normalize(48)} color="#FFF" />,
  //         text: 'Point at your homework problem',
  //         overlayStyle: styles.halfOverlay,
  //       };
  //     default:
  //       return {
  //         icon: <Icon name="magnify" size={normalize(48)} color="#FFF" />,
  //         text: 'Searching...',
  //         overlayStyle: styles.fullOverlay,
  //       };
  //   }
  // };

  const renderModeIcon = () => {
    switch (mode) {
      case 'translate':
        return <Text style={styles.translateText}>文A</Text>;
      case 'homework':
        return <Icon name="school" size={normalize(36)} color="#FFF" />;
      default:
        return <Icon name="magnify" size={normalize(36)} color="#FFF" />;
    }
  };

  const getHeight = () => {
    switch (mode) {
      case 'translate':
        return width*0.25;
      case 'homework':
        return width*0.5;
      default:
        return width*0.65;
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      {hasPermission && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          flashMode={flashMode}
          maxPhotoQualityPrioritization={'speed'}
          resetFocusWhenMotionDetected={true}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="arrow-left" size={normalize(32)} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setFlashMode(flashMode === 'on' ? 'off' : 'on')}>
            <Icon
              name={flashMode === 'on' ? 'flash' : 'flash-off'}
              size={normalize(24)}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Google Lens</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleGalleryPress}>
            <Icon name="history" size={normalize(24)} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
            <Icon name="dots-horizontal" size={normalize(24)} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.circleOverlay, ]}>
        <View style={[styles.scanCircle, {height: getHeight()}]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          {/* {showOverlay && (
            <Animated.View
              style={[
                getModeContent().overlayStyle,
                {
                  opacity: fadeAnim,
                },
              ]}>
              {getModeContent().icon}
              <Text style={styles.overlayText}>{getModeContent().text}</Text>
            </Animated.View>
          )} */}
        </View>
      </View>

      {mode === 'translate' && (
        <View style={styles.languageBar}>
          <Icon name="sparkles" size={normalize(16)} color="#000" />
          <Text style={styles.languageText}>Detect language → English</Text>
        </View>
      )}
      <View style={styles.galleryContainer}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleGalleryPress}>
          <Icon name="image-outline" size={normalize(18)} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner}>{renderModeIcon()}</View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, mode === 'translate' && styles.activeNav]}
          onPress={() => handleModeChange('translate')}>
          <Icon name="translate" size={normalize(14)} color="#0957cf" />
          <Text
            style={[styles.navText, mode === 'translate' && styles.activeText]}>
            Translate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, mode === 'search' && styles.activeNav]}
          onPress={() => handleModeChange('search')}>
          <Icon name="magnify" size={normalize(14)} color="#0957cf" />
          <Text
            style={[styles.navText, mode === 'search' && styles.activeText]}>
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, mode === 'homework' && styles.activeNav]}
          onPress={() => handleModeChange('homework')}>
          <Icon name="school" size={normalize(14)} color="#0957cf" />
          <Text
            style={[styles.navText, mode === 'homework' && styles.activeText]}>
            Homework
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoogleLensCamera;
