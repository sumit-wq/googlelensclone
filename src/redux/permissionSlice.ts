import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionType = 'camera' | 'photoLibrary' | 'location' | 'microphone';

interface PermissionState {
  camera: boolean;
  photoLibrary: boolean;
  location: boolean;
  notification: boolean;
  microphone: boolean;
}

const initialState: PermissionState = {
  camera: false,
  photoLibrary: false,
  location: false,
  notification: false,
  microphone: false,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setCameraPermission: (state, action: PayloadAction<boolean>) => {
      state.camera = action.payload;
    },
    setPhotoLibraryPermission: (state, action: PayloadAction<boolean>) => {
      state.photoLibrary = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.location = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.notification = action.payload;
    },
    setMicrophonePermission: (state, action: PayloadAction<boolean>) => {
      state.microphone = action.payload;
    },
    setMultiplePermissions: (state, action: PayloadAction<{ [K in PermissionType]?: boolean }>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key as PermissionType] = value;
      });
    },
    resetAllPermissions: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCameraPermission,
  setPhotoLibraryPermission,
  setLocationPermission,
  setNotificationPermission,
  setMicrophonePermission,
  setMultiplePermissions,
  resetAllPermissions,
} = permissionSlice.actions;

export default permissionSlice.reducer;
