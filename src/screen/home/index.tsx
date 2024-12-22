import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Platform,
    StatusBar,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/themeContext';
import HomeHeader from '../../layout/home/homeHeader';
import QuickActions from '../../layout/home/quickAction';
import SearchBox from '../../components/searchBox';
import NewsCard from '../../components/newsCard';
import { ThemeColors } from '../../theme/types';
import { NEWS_DATA } from '../../constants/news';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../utils/normalizer';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface ListItem {
    id: string;
    type: 'sticky' | 'header' | 'quickActions' | 'news';
    data?: any;
}

const HomeScreen = () => {
    const [isSticky, setIsSticky] = useState(false);
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const newsData = [...NEWS_DATA.articles];
    
    const listData: ListItem[] = [
        { id: 'header', type: 'header' },
        { id: 'sticky-search', type: 'sticky' },
        { id: 'quick-actions', type: 'quickActions' },
        ...newsData.map((article) => ({
            id: `news-${article.urlToImage}`,
            type: 'news' as const,
            data: article
        }))
    ];

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }
    }, []);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const newIsSticky = offsetY > STATUSBAR_HEIGHT+ normalize(20);
        if (isSticky !== newIsSticky) {
            setIsSticky(newIsSticky);
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(newIsSticky ? 'transparent' : colors.background);
            }
        }
    };

    const renderItem = ({ item }: { item: ListItem }) => {
        switch (item.type) {
            case 'header':
                return <HomeHeader onSearch={() => {}} />;
            case 'sticky':
                return (
                    <View style={[
                        styles.stickyHeader,
                        isSticky && styles.stickyHeaderActive
                    ]}>
                        <SearchBox isSticky={isSticky}/>
                    </View>
                );
            case 'quickActions':
                return (
           
                    <QuickActions />

                );
            case 'news':
                return <NewsCard article={item.data} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <StatusBar
                    translucent={isSticky}
                    backgroundColor='transparent'
                    barStyle={isSticky ? 'dark-content' : 'light-content'}
                />
                <FlatList
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    stickyHeaderIndices={[1]}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </SafeAreaView>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        paddingTop: Platform.OS === 'ios' ? 0 : STATUSBAR_HEIGHT,
    },
    stickyHeader: {
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: Platform.OS === 'ios' ? 0 : STATUSBAR_HEIGHT - normalize(32),
    },
    stickyHeaderActive: {

      backgroundColor: 'transparent',
  }
});

export default HomeScreen;