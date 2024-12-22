import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  BackHandler,
  Platform,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { normalize } from '../../utils/normalizer';

const SCREEN_HEIGHT = Dimensions.get('window').height - StatusBar.currentHeight;
const INITIAL_MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;
const SWIPE_THRESHOLD = 50;

const AccountModal = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(visible);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const animateToFullScreen = useCallback(() => {
    setIsFullScreen(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [translateY]);

  const animateToNormal = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start(() => {
      setIsFullScreen(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [translateY]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        bounciness: 0,
      }),
    ]).start(() => {
      setModalVisible(false);
      setIsFullScreen(false);
      onClose();
    });
  }, [opacity, translateY, onClose]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (modalVisible) {
          if (isFullScreen) {
            animateToNormal();
          } else {
            closeModal();
          }
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }
  }, [modalVisible, isFullScreen, animateToNormal, closeModal]);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      translateY.setValue(SCREEN_HEIGHT);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
        setIsScrollEnabled(false);
      },
      onPanResponderMove: (_, gestureState) => {
        if (isFullScreen && gestureState.dy < 0) return;
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        
        if (isFullScreen) {
          if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
            animateToNormal();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 0,
            }).start();
          }
        } else {
          if (gestureState.dy < -SWIPE_THRESHOLD || gestureState.vy < -0.5) {
            animateToFullScreen();
          } else if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
            closeModal();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 0,
            }).start();
          }
        }
        setIsScrollEnabled(true);
      },
    })
  ).current;

  const renderMenuItem = useCallback(({ icon, title, rightText }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      activeOpacity={0.7}
      key={title}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color='#5F6368' style={styles.menuIcon} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {rightText && (
        <Text style={styles.menuItemRight}>{rightText}</Text>
      )}
    </TouchableOpacity>
  ), []);

  if (!modalVisible) return null;

  const menuItems = [
    { icon: 'incognito', title: 'Turn on Incognito' },
    { icon: 'history', title: 'Search history', rightText: 'Saving' },
    { icon: 'clock-outline', title: 'Delete last 15 mins' },
    { icon: 'shield-check', title: 'SafeSearch' },
    { icon: 'bookmark-outline', title: 'Saves and collections' },
    { icon: 'file-document-outline', title: 'Results about you' },
    { icon: 'key-variant', title: 'Passwords' },
    { icon: 'account-outline', title: 'Your profile' },
    { icon: 'tune', title: 'Search personalisation' },
    { icon: 'cog-outline', title: 'Settings' },
    { icon: 'help-circle-outline', title: 'Help and feedback' },
  ];

  return (
    <Modal
      visible={true}
      transparent
      statusBarTranslucent
      animationType='none'
    >
      <StatusBar 
        backgroundColor='rgba(0, 0, 0, 0.5)' 
        barStyle={isFullScreen ? 'dark-content' : 'light-content'}
      />
      
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={closeModal}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }],
            ...(isFullScreen && {
              height: SCREEN_HEIGHT,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }),
            marginHorizontal: isFullScreen ? 0 : 16,
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[
          styles.headerContainer,
          isFullScreen && styles.fullScreenHeaderContainer
        ]}>
          <View style={[styles.header, isFullScreen && styles.fullScreenHeader]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Icon name='close' size={24} color='#5F6368' />
            </TouchableOpacity>
            <Image
              source={require('../../../assets/google.png')}
              style={styles.googleLogo}
              resizeMode='contain'
            />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={isScrollEnabled && isFullScreen}
          showsVerticalScrollIndicator={false}
          bounces={isFullScreen}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 }
          ]}
        >
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Image
                source={require('../../../assets/profile.png')}
                style={styles.profileImage}
              />
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>sumit kumar</Text>
                <Text style={styles.profileEmail}>kumarsumit925@gmail.com</Text>
              </View>
              <TouchableOpacity style={{ padding: 1, borderRadius: 100 }}>
                <Icon name='chevron-down' size={24} color='#5F6368' />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.manageAccountButton}>
              <Text style={styles.manageAccountText}>
                Manage your Google Account
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: INITIAL_MODAL_HEIGHT,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fullScreenHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8EAED',
  },
  fullScreenHeader: {
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 16,
    height: normalize(56),
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  googleLogo: {
    width: normalize(78),

  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? normalize(100) : normalize(72),
  },
  profileSection: {
    paddingHorizontal: 16,

  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#5F6368',
  },
  manageAccountButton: {
    backgroundColor: '#F1F3F4',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  manageAccountText: {
    color: '#202124',
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: '#202124',
  },
  menuItemRight: {
    fontSize: 14,
    color: '#5F6368',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EAED',
    marginTop: 8,
  },
  footerLink: {
    fontSize: 12,
    color: '#5F6368',
  },
  footerDot: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#5F6368',
  },
});

export default AccountModal;