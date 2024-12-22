import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/themeContext';
import { ThemeColors } from '../../theme/types';
import { normalize } from '../../utils/normalizer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ASPECT_RATIO = 16 / 9;

interface NewsCardProps {
    article: {
        source: {
            name: string;
        };
        title: string;
        urlToImage: string;
        url: string;
        sponsored?: boolean;
    };
    onPress?: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onPress }) => {
    const [isLiked, setIsLiked] = useState(false);
    const likeScale = useRef(new Animated.Value(1)).current;
    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const handleLikePress = () => {
        setIsLiked(!isLiked);
        
        rippleScale.setValue(0);
        rippleOpacity.setValue(0);
        
        Animated.parallel([
            Animated.sequence([
                Animated.spring(likeScale, {
                    toValue: 1.2,
                    useNativeDriver: true,
                    speed: 50,
                    bounciness: 20,
                }),
                Animated.spring(likeScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 50,
                    bounciness: 20,
                }),
            ]),
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(rippleScale, {
                        toValue: 2,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(rippleOpacity, {
                            toValue: 0.3,
                            duration: 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(rippleOpacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]),
        ]).start();
    };

    const handleSharePress = async () => {
        try {
            const result = await Share.share({
                message: `${article.title}\n\n${article.url}`,
                url: article.url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.card}>
                <Image
                    source={{ uri: article.urlToImage }}
                    style={styles.image}
                    resizeMode='cover'
                />
                <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={2}>
                            {article.title}
                        </Text>
                    </View>
                    <View style={styles.bottomRow}>
                        <View style={styles.sourceContainer}>
                            {article.sponsored ? (
                                <Text style={styles.sponsoredText}>Sponsored</Text>
                            ) : (
                                <Text style={styles.sourceText}>
                                    {article.source.name}
                                </Text>
                            )}
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={handleLikePress}>
                                <View style={styles.heartContainer}>
                                    <Animated.View 
                                        style={[
                                            styles.ripple,
                                            {
                                                transform: [{ scale: rippleScale }],
                                                opacity: rippleOpacity,
                                                backgroundColor: isLiked ? '#FF0000' : 'transparent',
                                            },
                                        ]}
                                    />
                                    <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                                        <Icon
                                            name={isLiked ? 'heart' : 'heart-outline'}
                                            size={22}
                                            color={isLiked ? '#FF0000' : colors.textSecondary}
                                        />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSharePress} style={styles.shareButton}>
                                <Icon
                                    name='share-variant'
                                    size={22}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon
                                    name='dots-vertical'
                                    size={22}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    heartContainer: {
        position: 'relative',
        width: normalize(32),
        height: normalize(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ripple: {
        position: 'absolute',
        width: normalize(32),
        height: normalize(32),
        borderRadius: 16,
    },
    container: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        marginVertical: 4,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: (SCREEN_WIDTH - 32) / ASPECT_RATIO,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    contentContainer: {
        padding: 12,
    },
    titleContainer: {
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.textPrimary,
        lineHeight: 22,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    sourceContainer: {
        flex: 1,
    },
    sourceText: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    sponsoredText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    shareButton: {
        marginHorizontal: 16,
    },
});

export default NewsCard;
