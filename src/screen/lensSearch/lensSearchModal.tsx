import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import {debounce} from 'lodash';
import SkeletonGrid from '../../components/loadingScreen';
import {generateMockData, filterAndRandomizeData} from '../../utils';
import {styles} from './styles';
import {normalize} from '../../utils/normalizer';

const {width, height: SCREEN_HEIGHT} = Dimensions.get('window');
const COLUMN_COUNT = 2;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
const SEARCH_BAR_HEIGHT = 50;
const ITEMS_PER_PAGE = 20;
const SCROLL_THRESHOLD = 50;

interface ImageData {
  uri: string;
  type: string;
  source: 'camera' | 'gallery';
  width?: number;
  height?: number;
  fileName?: string;
  fileSize?: number;
}

interface SearchResult {
  id: string;
  imageUrl: string;
  title: string;
  platform: string;
  platformIcon?: string;
  height?: number;
}

interface Props {
  imageUri: string;
  initialHeight: number;
  onExpandChange?: (expanded: boolean) => void;
  style?: any;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LensScreen: React.FC<Props> = ({
  imageUri,
  initialHeight,
  onExpandChange,
  style,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const searchBarTranslateY = useRef(new Animated.Value(0)).current;
  const searchBarOpacity = useRef(new Animated.Value(1)).current;
  const containerHeight = useRef(new Animated.Value(initialHeight)).current;
  const scrollStartY = useRef(0);

  useEffect(() => {
    loadMoreData(true);
  }, []);

  const animateContainer = useCallback(
    (toExpanded: boolean) => {
      const targetHeight = toExpanded ? SCREEN_HEIGHT : initialHeight;

      Animated.timing(containerHeight, {
        toValue: targetHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [initialHeight, containerHeight],
  );

  const animateSearchBar = useCallback(
    (show: boolean) => {
      if (!isExpanded) {
        searchBarOpacity.setValue(1);
        searchBarTranslateY.setValue(0);
        return;
      }

      Animated.parallel([
        Animated.timing(searchBarOpacity, {
          toValue: show ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(searchBarTranslateY, {
          toValue: show ? 0 : -SEARCH_BAR_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setIsSearchBarVisible(show);
    },
    [isExpanded, searchBarOpacity, searchBarTranslateY],
  );

  const loadMoreData = useCallback(
    async (isInitial = false) => {
      if (isLoading || (!hasMore && !isInitial)) return;

      setIsLoading(true);
      try {
        const mockData = generateMockData(ITEMS_PER_PAGE);
        setSearchResults(prevResults =>
          isInitial ? [...mockData] : [...prevResults, ...mockData],
        );
        setPage(prevPage => prevPage + 1);
        setHasMore(page * ITEMS_PER_PAGE < 1000);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, page, isLoading, hasMore],
  );

  const handleSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchTerm(term);
        setPage(1);
        const filteredData = filterAndRandomizeData(term);
        setSearchResults(filteredData.slice(0, ITEMS_PER_PAGE));
        setHasMore(filteredData.length > ITEMS_PER_PAGE);
      }, 300),
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      if (currentScrollY < 0) return;

      if (!isExpanded) {
        if (currentScrollY > SCROLL_THRESHOLD) {
          setIsExpanded(true);
          onExpandChange?.(true);
          animateContainer(true);
        }
      } else {
        const scrollDelta = currentScrollY - lastScrollY.current;
        if (Math.abs(scrollDelta) < 2) return;

        const shouldShowSearchBar = scrollDelta < 0;
        if (shouldShowSearchBar !== isSearchBarVisible) {
          animateSearchBar(shouldShowSearchBar);
        }
      }

      lastScrollY.current = currentScrollY;
    },
    [
      isExpanded,
      isSearchBarVisible,
      animateContainer,
      animateSearchBar,
      onExpandChange,
    ],
  );

  const handleScrollBeginDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollStartY.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;

      if (!isExpanded && currentScrollY > SCROLL_THRESHOLD) {
        setIsExpanded(true);
        onExpandChange?.(true);
        animateContainer(true);
      } else if (currentScrollY <= 0 && isExpanded) {
        setIsExpanded(false);
        onExpandChange?.(false);
        animateContainer(false);
        animateSearchBar(true);
      }
    },
    [isExpanded, animateContainer, animateSearchBar, onExpandChange],
  );

  const renderSearchBar = useCallback(
    () => (
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            transform: [{translateY: searchBarTranslateY}],
            opacity: searchBarOpacity,
          },
        ]}>
        <View style={styles.searchContainer}>
          <Image
            source={require('../../../assets/googleIcon.png')}
            style={styles.cameraIcon}
          />
          <Image
            style={{
              height: normalize(48),
              width: normalize(64),
              borderRadius: normalize(8),
              borderWidth: 1,
            }}
            source={imageUri}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Add to search"
            value={searchTerm}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
          />
        </View>
      </Animated.View>
    ),
    [searchTerm, handleSearch, searchBarTranslateY, searchBarOpacity],
  );

  const renderTabs = useCallback(
    () => (
      <View style={styles.tabsOuterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}>
          {['All', 'Products', 'Homework', 'Visual matches', 'About'].map(
            tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>
    ),
    [activeTab],
  );

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<SearchResult>) => {
      const imageHeight = item.height || (index % 2 === 0 ? 200 : 250);
      const infoHeight = 80;
      const totalHeight = imageHeight + infoHeight;
      return (
        <TouchableOpacity
          style={[
            styles.itemContainer,
            {
              height: totalHeight,
              marginTop: index % 2 === 0 ? 0 : 20,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => console.log('Item pressed:', item.id)}>
          <Image
            source={{uri: item.imageUrl}}
            style={[styles.itemImage, {height: imageHeight}]}
            resizeMode="cover"
          />
          <View style={styles.itemInfo}>
            <View style={styles.platformContainer}>
              <Image
                source={{uri: item.platformIcon || 'https://picsum.photos/20'}}
                style={styles.platformIcon}
              />
              <Text style={styles.platformText}>{item.platform}</Text>
            </View>
            <Text numberOfLines={2} style={styles.itemTitle}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [],
  );

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMoreData();
    }
  }, [isLoading, hasMore, loadMoreData]);

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) return null;
    return <Text style={styles.emptyText}>No results found</Text>;
  }, [isLoading]);

  const ListFooterComponent = useCallback(() => {
    if (!isLoading) return null;
    return <SkeletonGrid />;
  }, [isLoading]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: containerHeight,
          backgroundColor: '#fff',
        },
        style,
      ]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />

      <View style={styles.header}>
        <SafeAreaView>{renderSearchBar()}</SafeAreaView>
      </View>

      <AnimatedFlatList
        data={searchResults}
        renderItem={renderItem}
        ListHeaderComponent={renderTabs}
        keyExtractor={item => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={[
          styles.flatListContent,
          {
            minHeight: isExpanded ? SCREEN_HEIGHT + 1 : initialHeight + 1,
            paddingTop: HEADER_HEIGHT,
          },
        ]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
            listener: handleScroll,
          },
        )}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </Animated.View>
  );
};

export default LensScreen;
