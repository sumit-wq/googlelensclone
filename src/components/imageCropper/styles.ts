// styles.ts
import { StyleSheet } from 'react-native';
import { normalize } from '../../utils/normalizer';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#000',
    position: 'relative',
    height: '100%',
  },
  cropperContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: -normalize(48),
    left: 16,
  },
  overlay: {
    position: 'absolute',
  },
  cropOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: normalize(16),
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: normalize(16),
  },
  bottomLeft: {
    bottom: normalize(300),
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: normalize(16),
  },
  bottomRight: {
    bottom: normalize(300),
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: normalize(16), 
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#000',
  },
  previewContainer: {
    marginTop: 20,
    height: 100,
  },
  previewImage: {
    flex: 1,
  },
  screenHeader: {
    // Add header styles if needed
  },
});

export default styles;