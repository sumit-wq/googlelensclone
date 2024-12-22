import React, { useEffect, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert, StyleSheet, Vibration } from 'react-native';
import { useDispatch } from 'react-redux';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Platform } from 'react-native';
import {
  setCameraPermission,
  setPhotoLibraryPermission,
  setLocationPermission,
  setNotificationPermission,
  setMicrophonePermission,
  PermissionType
} from '../../redux/permissionSlice';

const PERMISSION_MAP = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }),
  photoLibrary: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  }),
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  }),
  microphone: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }),
};

export class PermissionManager {
  private static dispatch: any = null;

  static initialize(dispatch: any) {
    this.dispatch = dispatch;
  }

  private static getPermissionAction(type: PermissionType) {
    const actions = {
      camera: setCameraPermission,
      photoLibrary: setPhotoLibraryPermission,
      location: setLocationPermission,
      notification: setNotificationPermission,
      microphone: setMicrophonePermission,
    };
    return actions[type];
  }

  static async checkPermission(type: PermissionType): Promise<boolean> {
    try {
      const permission = PERMISSION_MAP[type];
      if (!permission) return false;

      const result = await check(permission);
      const isGranted = result === RESULTS.GRANTED;
      this.dispatch(this.getPermissionAction(type)(isGranted));
      return isGranted;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  static async requestPermission(type: PermissionType): Promise<boolean> {
    try {
      const permission = PERMISSION_MAP[type];
      if (!permission) return false;

      const currentStatus = await check(permission);
      
      if (currentStatus === RESULTS.GRANTED) {
        this.dispatch(this.getPermissionAction(type)(true));
        return true;
      }

      if (currentStatus === RESULTS.BLOCKED) {
        this.handlePermissionDenied(type);
        return false;
      }

      const result = await request(permission);
      const isGranted = result === RESULTS.GRANTED;
      this.dispatch(this.getPermissionAction(type)(isGranted));

      if (!isGranted) {
        this.handlePermissionDenied(type);
      }

      return isGranted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  private static handlePermissionDenied(type: PermissionType) {
    Alert.alert(
      'Permission Required',
      `${type} permission is required for this feature. Would you like to open settings to grant it?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => openSettings()
        }
      ]
    );
  }
}

const PermissionBoot: React.FC = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      PermissionManager.initialize(dispatch);
  
      const checkAndRequestLocation = async () => {
        const hasLocationPermission = await PermissionManager.checkPermission('location');
        
        if (!hasLocationPermission) {
          await PermissionManager.requestPermission('location');
        }
      };
  
      const checkOtherPermissions = async () => {
        const otherPermissions: PermissionType[] = [
          'camera', 
          'photoLibrary', 
          'microphone'
        ];
        
        for (const type of otherPermissions) {
          await PermissionManager.checkPermission(type);
        }
      };
      
      const initializePermissions = async () => {
        await checkAndRequestLocation();
        await checkOtherPermissions();
      };
  
      initializePermissions();
    }, [dispatch]);
  
    return <></>;
  };
  
  export default PermissionBoot;