import React, {useState, useMemo, SetStateAction} from 'react';
import {View, Text, FlatList, Platform, Keyboard} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import SearchHeader from '../../components/search/searchbar';
import SearchItem from '../../components/search/searchItem';
import {normalize} from '../../utils/normalizer';
import {useDebounce} from '../../hooks/useDebounce';
import {
  RECENT_SEARCHES,
  TRENDING_SEARCHES,
} from '../../constants/searchHistory';
import {getFilteredSuggestions, generateMockSuggestions} from '../../utils';

const MOCK_SUGGESTIONS = generateMockSuggestions();

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [searchData, setSearchData] = useState([
    {id: 'recent-header', isRecent: true, type: 'header'},
    ...RECENT_SEARCHES,
    {id: 'trending-header', isTrending: true, type: 'header'},
    ...TRENDING_SEARCHES,
  ]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredSuggestions = useMemo(() => {
    return getFilteredSuggestions(MOCK_SUGGESTIONS, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query,
      )}`;
      setWebViewUrl(searchUrl);
      setShowWebView(true);
      Keyboard.dismiss();
    } else {
      setWebViewUrl('');
      setShowWebView(false);
    }
  };

  const handleItemPress = (item: {text: SetStateAction<string>}) => {
    setSearchQuery(item.text);
    handleSearch(item.text);
  };

  const handleDeleteItem = (id: string) => {
    setSearchData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleBackPress = () => {
    if (showWebView) {
      setShowWebView(false);
      return;
    }
    navigation.goBack();
  };

  const handleVoicePress = () => {
    navigation.navigate('Audio');
  };

  const handleLensPress = () => {
    navigation.navigate('Lens');
  };

  const renderItem = ({item}) => {
    if (item.isRecent) {
      return (
        <View
          style={{
            paddingVertical: normalize(8),
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
          }}>
          <Text
            style={{
              fontSize: normalize(14),
              paddingHorizontal: normalize(16),
            }}>
            Recent searches
          </Text>
          <Text
            style={{
              fontSize: normalize(14),
              paddingHorizontal: normalize(16),
              color: '#666',
            }}>
            Manage History
          </Text>
        </View>
      );
    }

    if (item.isTrending) {
      return (
        <Text
          style={{
            fontSize: normalize(14),
            paddingHorizontal: normalize(16),
            marginVertical: normalize(16),
          }}>
          What's trending
        </Text>
      );
    }

    return (
      <SearchItem
        item={item}
        onDelete={handleDeleteItem}
        onPress={() => handleItemPress(item)}
        onInfo={() => {}}
      />
    );
  };

  const displayData = searchQuery.trim()
    ? [
        {id: 'localSearchableText', text: searchQuery, type: 'suggestion'},
        ...filteredSuggestions,
      ]
    : searchData;

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          zIndex: 1000,
          backgroundColor: '#fff',
          paddingTop: Platform.OS === 'ios' ? 44 : 20,
        }}>
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCameraPress={handleLensPress}
          onVoicePress={handleVoicePress}
          onBackPress={handleBackPress}
          onSearch={undefined}
        />
      </View>

      {showWebView ? (
        <View style={{flex: 1, marginTop: -normalize(100)}}>
          <WebView
            source={{uri: webViewUrl}}
            style={{flex: 1}}
            startInLoadingState
          />
        </View>
      ) : (
        <FlatList
          data={displayData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{flex: 1}}
          removeClippedSubviews={false}
          windowSize={10}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
        />
      )}
    </View>
  );
};

export default SearchScreen;
