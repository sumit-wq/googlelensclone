import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/themeContext';
import { normalize } from '../../utils/normalizer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { ThemeColors } from '../../theme/types';

const SearchBox = ({isSticky}) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const styles = createStyles(colors);

    const handleSearchPress = () => {
        navigation.navigate('Search');
    };

    const handleMicPress = () => {
        navigation.navigate('Audio');
    };

    const handleLensPress = () => {
        navigation.navigate('Lens');
    };

    return (
        <View style={[styles.container, isSticky && styles.stickyHeaderActive]}>
            <TouchableWithoutFeedback 
                style={styles.searchSection} 
                onPress={handleSearchPress}
            >
                <Icon 
                    name='search' 
                    size={normalize(28)} 
                    color={colors.textSecondary} 
                />
                <Text style={styles.searchText}>Search</Text>
            </TouchableWithoutFeedback>

            <View style={styles.actionButtons}>
                <TouchableWithoutFeedback 
                    style={styles.iconButton} 
                    onPress={handleMicPress}
                >
                    <Image 
                        source={require('../../../assets/mic.png')} 
                        style={styles.icon} 
                    />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback 
                    style={styles.iconButton} 
                    onPress={handleLensPress}
                >
                    <Image 
                        source={require('../../../assets/lens.png')} 
                        style={styles.icon} 
                    />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        height: normalize(84),
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: normalize(74),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(8),
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: normalize(24),
        height: '100%',
    },
    searchText: {
        marginLeft: normalize(8),
        color: colors.textSecondary,
        fontSize: normalize(24),
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: normalize(50),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: normalize(36),
        height: normalize(34),
    },
    stickyHeaderActive: {
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    }
});

export default SearchBox;