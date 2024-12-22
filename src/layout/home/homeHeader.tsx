import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {normalize} from '../../utils/normalizer';
import {useTheme} from '../../theme/themeContext';
import {ThemeColors} from '../../theme/types';
import AccountModal from './accountModal';

interface HomeHeaderProps {
  onSearch: (text: string) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({onSearch}) => {
  const [isGemini, setIsGemini] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flaskOpacity = useRef(new Animated.Value(1)).current;
  const searchTextOpacity = useRef(new Animated.Value(1)).current;
  const geminiTextOpacity = useRef(new Animated.Value(0)).current;

  const {colors} = useTheme();
  const styles = createStyles(colors);

  const handleToggleSearchType = () => {
    const toValue = isGemini ? 0 : 1;

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flaskOpacity, {
        toValue: isGemini ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchTextOpacity, {
        toValue: isGemini ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(geminiTextOpacity, {
        toValue: isGemini ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsGemini(prev => !prev);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, normalize(44)],
  });

  const renderSearchTypeButton = () => (
    <TouchableOpacity
      onPress={handleToggleSearchType}
      style={[styles.searchTypeContainer]}>
        <View style={[styles.searchTypeSection, 
          {paddingRight: isGemini ? normalize(8) : 0 }
        ]}>
          <Image
            source={require('../../../assets/googleIcon.png')}
            style={styles.searchTypeIcon}
          />
          <Animated.Text
            style={[styles.buttonText, {opacity: searchTextOpacity}]}>
            {!isGemini ? 'Search' : ''}
          </Animated.Text>
        </View>

        <View style={[styles.searchTypeSection, {paddingLeft: !isGemini ? normalize(12) : normalize(4)}]}>
          <Image
            source={require('../../../assets/gemini.png')}
            style={styles.searchTypeIcon}
          />
          <Animated.Text
            style={[styles.buttonText, {opacity: geminiTextOpacity}]}>
            {isGemini ? 'Gemini' : ''}
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.animatedBackground,
            {
              transform: [{translateX}],
            },
          ]}
        />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Animated.View style={[styles.iconWrapper, {opacity: flaskOpacity}]}>
            <Icon name='flask' size={36} color={colors.primary} />
          </Animated.View>
        </View>
        {renderSearchTypeButton()}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowAccountModal(true)}>
          <Image
            source={require('../../../assets/profile.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/google.png')}
          style={styles.googleLogo}
          resizeMode='contain'
        />
      </View>
      <AccountModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconContainer: {
      height: normalize(36),
      width: normalize(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapper: {
      position: 'absolute',
    },
    searchTypeContainer: {
      width: normalize(160),
      height: normalize(48),
      backgroundColor: '#f2f3f5',
      borderRadius: normalize(8),
      padding: normalize(6),
      paddingHorizontal: normalize(8),
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },

    searchTypeSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    animatedBackground: {
      position: 'absolute',
      width: normalize(94),
      height: normalize(36),
      backgroundColor: colors.background,
      borderRadius: normalize(6),
      zIndex: 0,
    left: 14,
    },
    searchTypeIcon: {
      width: normalize(28),
      height: normalize(28),
      marginRight: normalize(4),
    },
    buttonText: {
      fontSize: normalize(16),
      fontWeight: '500',
      color: colors.textPrimary,
    },
    profileButton: {
      borderRadius: normalize(18),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileImage: {
      width: normalize(36),
      height: normalize(36),
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: normalize(20),
    },
    googleLogo: {
      width: normalize(150),
      height: normalize(100),
    },
  });

export default HomeHeader;
