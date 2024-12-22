import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { normalize } from '../../utils/normalizer';
import { useTheme } from '../../theme/themeContext';
import { ThemeColors } from '../../theme/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface QuickActionItem {
    icon: string;
    color: string;
    bg: string;
}

interface InfoCardProps {
    title: string;
    subtitle?: string;
    temperature?: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
    { icon: 'image-outline', color: '#b16000', bg: '#fdf7df' },
    { icon: 'translate', color: '#1b68d2', bg: '#e7f0fd' },
    { icon: 'school-outline', color: '#167331', bg: '#e6f4e9' },
    { icon: 'music-note', color: '#c5211f', bg: '#fce8e6' },
];

export const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, temperature }) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
        <TouchableOpacity style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{title}</Text>
            {subtitle && <Text style={styles.infoCardSubtitle}>{subtitle}</Text>}
            {temperature && (
                <View style={styles.temperatureContainer}>
                    <Text style={styles.temperature}>{temperature}</Text>
                    <Icon 
                        name='wave' 
                        size={20} 
                        color={colors.textSecondary} 
                        style={styles.weatherIcon}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export const QuickActions: React.FC = () => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
        <View>
            <View style={styles.quickActions}>
                {QUICK_ACTIONS.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.quickActionButton, { backgroundColor: item.bg }]}>
                        <Icon name={item.icon} size={24} color={item.color} />
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}>
                <InfoCard title='Test · Day 5' subtitle='AUS 445 & 89/7d' />
                <InfoCard title='Rai Durg' temperature='24°' />
                <InfoCard title='Air Quality' subtitle='Moderate' />
            </ScrollView>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: normalize(16),
        paddingBottom: normalize(12),
        marginBottom: normalize(12),
        paddingHorizontal: normalize(16),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    quickActionButton: {
        width: normalize(84),
        height: normalize(64),
        borderRadius: normalize(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        paddingHorizontal: normalize(16),

                            marginBottom: normalize(16),
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: normalize(12),
        padding: normalize(12),
        marginRight: 8,
        width: CARD_WIDTH,
        height: normalize(104),
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoCardTitle: {
        fontSize: normalize(16),
        fontWeight: '500',
        color: colors.textPrimary,
    },
    infoCardSubtitle: {
        fontSize: normalize(14),
        color: colors.textSecondary,
        marginTop: 4,
    },
    temperatureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    temperature: {
        fontSize: normalize(24),
        fontWeight: '500',
        color: colors.textPrimary,
        marginRight: 8,
    },
    weatherIcon: {
        marginLeft: 'auto',
    },
});

export default QuickActions;