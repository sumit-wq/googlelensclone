import { Dimensions, Platform, StyleSheet } from "react-native";
import { normalize } from "../../utils/normalizer";

const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.65;
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
      height: 100
    },

    header: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : normalize(30),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: normalize(16),
      zIndex: 1,
    },
    headerTitle: {
      color: '#FFF',
      fontSize: normalize(20),
      fontWeight: '500',
    },
    headerButton: {
      padding: normalize(8),
    },
    headerLeft: {
      flexDirection: 'row',
    },
    headerRight: {
      flexDirection: 'row',
    },
    circleOverlay: {
      position: 'absolute',
      top: normalize(200),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanCircle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      borderColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    corner: {
      position: 'absolute',
      width: normalize(38),
      height: normalize(38),
      borderColor: '#FFF',
    },
    topLeft: {
      top: normalize(-10),
      left: normalize(-10),
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopLeftRadius: normalize(28),
    },
    topRight: {
      top: normalize(-10),
      right: normalize(-10),
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderTopRightRadius: normalize(28),
    },
    bottomLeft: {
      bottom: normalize(-10),
      left: normalize(-10),
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderBottomLeftRadius: normalize(28),
    },
    bottomRight: {
      bottom: normalize(-10),
      right: normalize(-10),
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderBottomRightRadius: normalize(28),
    },
    centerIcon: {
      width: normalize(44),
      height: normalize(44),
      justifyContent: 'center',
      alignItems: 'center',
    },
    translateText: {
      color: '#FFF',
      fontSize: normalize(36),
      fontWeight: '500',
    },
    languageBar: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? normalize(100) : normalize(80),
      alignSelf: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(8),
      borderRadius: normalize(20),
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(8),
    },
    languageText: {
      fontSize: normalize(14),
      color: '#000',
    },
    galleryContainer: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? normalize(150) : normalize(140),
      alignSelf: 'center',
      left: normalize(48),
    },
    galleryButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: normalize(12),
      borderRadius: normalize(90),
      backgroundColor: '#000',
      opacity: 0.8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#FFF',
    },
    galleryText: {
      color: '#FFF',
      fontSize: normalize(12),
      marginTop: normalize(4),
    },
    captureContainer: {
      position: 'absolute',
      bottom: normalize(136),
      alignSelf: 'center',
    },
    captureButton: {
      width: normalize(70),
      height: normalize(70),
      borderRadius: normalize(35),
      backgroundColor: 'rgba(255, 255, 255, 0.23)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 5,
      borderColor: 'white',
    },
    captureInner: {
      width: normalize(54),
      height: normalize(54),
      borderRadius: normalize(27),
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
    },
    bottomNav: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? normalize(34) : normalize(0),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: normalize(20),
      backgroundColor: '#FFF',
      paddingBottom: normalize(48),
      paddingTop: normalize(8),
      gap: normalize(8),
    },
    navButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(6),
      borderRadius: normalize(90),
      minWidth: normalize(80),
      flexDirection: 'row',
      gap: normalize(8),
      borderWidth: StyleSheet.hairlineWidth,
    },
    activeNav: {
      backgroundColor: '#cadfff',
      borderWidth: 0,
    },
    navText: {
      color: '#202124',
      marginTop: normalize(4),
      fontSize: normalize(14),
    },
    activeText: {
      color: '#0957cf',
    }
  });