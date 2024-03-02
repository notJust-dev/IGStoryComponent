import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

import usersStories from '../stories';

const storyViewDuration = 5 * 1000;

export default function IgStories() {
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  const progress = useSharedValue(0); // 0 -> 1

  const user = usersStories[userIndex];
  const story = user.stories[storyIndex];

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: storyViewDuration,
      easing: Easing.linear,
    });
  }, [storyIndex, userIndex]);

  const goToPrevStory = () => {
    setStoryIndex((index) => {
      if (index === 0) {
        goToPrevUser();
         return usersStories[userIndex - 1].stories.length - 1;
      }
      return index - 1;
    });
  };

  const goToNextStory = () => {
    setStoryIndex((index) => {
      if (index === user.stories.length - 1) {
        goToNextUser();
        return 0;
      }
      return index + 1;
    });
  };

  const goToNextUser = () => {
    setUserIndex((index) => {
      if (index === usersStories.length - 1) {
        return 0;
      }
      return index + 1;
    });
  };

  const goToPrevUser = () => {
    setUserIndex((index) => {
      if (index === 0) {
        return usersStories.length - 1;
      }
      return index - 1;
    });
  };

  useAnimatedReaction(
    () => progress.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue === 1) {
        runOnJS(goToNextStory)();
      }
    }
  );

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.storyContainer}>
        <Image source={{ uri: story.uri }} style={styles.image} />

        <Pressable style={styles.navPressable} onPress={goToPrevStory} />

        <Pressable
          style={[styles.navPressable, { right: 0 }]}
          onPress={goToNextStory}
        />

        <View style={styles.header}>
          <LinearGradient
            // Background Linear Gradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.indicatorRow}>
            {user.stories.map((story, index) => (
              <View key={`${user.userId}-${index}`} style={styles.indicatorBG}>
                <Animated.View
                  style={[
                    styles.indicator,
                    index === storyIndex && indicatorAnimatedStyle,
                    index > storyIndex && { width: 0 },
                    index < storyIndex && { width: '100%' },
                  ]}
                />
              </View>
            ))}
          </View>

          <Text style={styles.username}>{user.username}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Send message"
          placeholderTextColor="white"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    padding: 20,
    paddingTop: 10,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    backgroundColor: 'black',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 50,
    color: 'white',
  },
  navPressable: {
    position: 'absolute',
    width: '30%',
    height: '100%',
  },

  indicatorRow: {
    gap: 5,
    flexDirection: 'row',
    marginBottom: 20,
  },

  indicatorBG: {
    flex: 1,
    height: 3,
    backgroundColor: 'gray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  indicator: {
    backgroundColor: 'white',
    height: '100%',
  },
});
