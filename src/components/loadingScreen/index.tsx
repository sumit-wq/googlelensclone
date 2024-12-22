import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 32) / 2;

interface ShimmerProps {
  width?: number | string;
  height?: number;
  style?: any;
}

const Shimmer = ({ width: customWidth, height = 200, style }: ShimmerProps) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const resolvedWidth = typeof customWidth === 'number' ? customWidth : parseFloat(customWidth as string);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, { width: resolvedWidth, height }, style]}>
      <View style={[styles.background, { width: resolvedWidth, height }]} />
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const SkeletonGrid = () => {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.itemContainer}>
          <Shimmer width={ITEM_WIDTH} height={Math.random() * 100 + 150} />
          <View style={styles.textContainer}>
            <Shimmer width={40} height={15} style={styles.smallShimmer} />
            <Shimmer width={ITEM_WIDTH - 20} height={15} style={styles.smallShimmer} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  background: {
    backgroundColor: '#E1E9EE',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.5,
    position: 'absolute',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 4,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  textContainer: {
    padding: 8,
    gap: 8,
  },
  smallShimmer: {
    borderRadius: 2,
  },
});

export default SkeletonGrid;
