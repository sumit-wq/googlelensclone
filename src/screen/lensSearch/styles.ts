import {StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import {ViewStyle, TextStyle, ImageStyle} from 'react-native';
import { normalize } from '../../utils/normalizer';

const {width, height} = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 32) / COLUMN_COUNT;
const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 120 : 110;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  searchContainer: ViewStyle;
  masonryContainer: ViewStyle;
  masonryColumn: ViewStyle;
  cameraIcon: ImageStyle;
  searchInput: TextStyle;
  tabContainer: ViewStyle;
  tabContentContainer: ViewStyle;
  tab: ViewStyle;
  activeTab: ViewStyle;
  tabText: TextStyle;
  activeTabText: TextStyle;
  gridContainer: ViewStyle;
  itemContainer: ViewStyle;
  itemImage: ImageStyle;
  itemInfo: ViewStyle;
  platformContainer: ViewStyle;
  platformIcon: ImageStyle;
  platformText: TextStyle;
  itemTitle: TextStyle;
  emptyText: TextStyle;
  loadingContainer: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
  loadMoreButton: ViewStyle;
  loadMoreButtonText: TextStyle;
  errorContainer: ViewStyle;
  columnWrapper: ViewStyle;
  flatListContent: ViewStyle;
  upperContent: ViewStyle;
  cropperContainer: ViewStyle;
  headerTitle: TextStyle;
  lensScreen: ViewStyle;
  searchBarContainer: ViewStyle;
  tabsOuterContainer: ViewStyle
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  // header: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: '#fff',
  //   zIndex: 9,
  //   paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  //   paddingHorizontal: 16,
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   borderBottomColor: '#ddd',
  // },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 9,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  tabsOuterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginTop: Platform.OS === 'ios' ? 110 : 90,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f3',
    borderRadius: 80,
    paddingHorizontal: 16,
    height: 64,
    marginHorizontal: 12,
    marginTop: 32
  },
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : -20,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
  },
  masonryContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingTop: HEADER_MAX_HEIGHT + 8,
  },
  masonryColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
    includeFontPadding: false,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabContentContainer: {
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
  tabsOuterContainer: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    marginTop: -16,
    marginBottom:4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    color: '#70757b',
    fontWeight: '400',
  },
  activeTabText: {
    color: '#1a73e8',
    fontWeight: '500',
  },
  gridContainer: {
    padding: 8,
    paddingTop: HEADER_MAX_HEIGHT + 8,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    padding: 12,
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  platformIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
    backgroundColor: '#ddd',
  },
  platformText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  itemTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
    fontSize: 16,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#dc3545',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4285f4',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  flatListContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  upperContent: {
    backgroundColor: '#000',
    position: 'relative',
  },
  cropperContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  lensScreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  imageSearch : {
    height: normalize(48),
    width: normalize(64),
  }
});

export const CONSTANTS = {
  COLUMN_COUNT,
  ITEM_WIDTH,
  HEADER_MAX_HEIGHT,
  HEADER_MIN_HEIGHT,
  HEADER_SCROLL_DISTANCE,
};
