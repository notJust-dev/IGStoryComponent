import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Button, Image } from 'react-native';
import IgStories from './components/IgStories';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import usersStories from './stories';
const allStories = usersStories.flatMap((user) => user.stories);

const pages = ['#E1F3FA', '#308D46', 'red', 'yellow', 'blue'];
const width = 200;

const AnimatedPage = ({ pageColor, index, pageIndex, children }) => {
  const anim = useAnimatedStyle(() => ({
    transform: [
      {
        perspective: width * 2,
      },
      {
        rotateY: `${interpolate(
          pageIndex.value,
          [index - 1, index, index + 1],
          [90, 0, -90]
        )}deg`,
      },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          zIndex: 100 - index,
          width,
          position: 'absolute',
          aspectRatio: 9 / 16,
          backgroundColor: pageColor,
          backfaceVisibility: 'hidden',
          borderRadius: 10,
          transformOrigin: ['50%', '50%', -width / 2],
          overflow: 'hidden',
        },
        anim,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default function App() {
  const pageIndex = useSharedValue(0);

  const runAnimation = () => {
    // pageIndex.value = 0;
    pageIndex.value = withTiming(Math.floor(pageIndex.value + 1), {
      duration: 500,
    });
  };

  const goBack = () => {
    pageIndex.value = withTiming(Math.floor(pageIndex.value - 1), {
      duration: 300,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <IgStories /> */}

      {allStories.map((story, index) => (
        <AnimatedPage pageColor={'black'} pageIndex={pageIndex} index={index}>
          <Image
            source={{ uri: story.uri }}
            style={{ width: '100%', height: '100%' }}
          />
        </AnimatedPage>
      ))}

      <View style={{ position: 'absolute', bottom: 50 }}>
        <Button title="Next" onPress={runAnimation} />
        <Button title="Prev" onPress={goBack} />
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
