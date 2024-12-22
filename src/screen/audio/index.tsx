import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionManager } from '../../managers/permissionManager';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const VoiceRecorderScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const recordingTimeout = useRef(null);
  const initialSilenceTimer = useRef(null);
  const animationValues = [...Array(4)].map(() => useRef(new Animated.Value(1)).current);
  const dotColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

  useEffect(() => {
    const initialize = async () => {
      const permission = await checkPermission();
      if (permission) {
        startListeningAnimation();
      }
    };

    initialize();
    return () => cleanUp();
  }, []);

  const checkPermission = async () => {
    const permission = await PermissionManager.checkPermission('microphone');
    if (!permission) {
      const granted = await PermissionManager.requestPermission('microphone');
      setHasPermission(granted);
      return granted;
    }
    setHasPermission(true);
    return true;
  };

  const cleanUp = async () => {
    if (recordingTimeout.current) {
      clearTimeout(recordingTimeout.current);
    }
    if (initialSilenceTimer.current) {
      clearTimeout(initialSilenceTimer.current);
    }
    if (isRecording) {
      await stopRecording();
    }
    animationValues.forEach(anim => anim.stopAnimation());
  };

  const startListeningAnimation = () => {
    animationValues.forEach(anim => anim.setValue(1));

    const waveAnimation = animationValues.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 80),
          Animated.timing(anim, {
            toValue: 1.3,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 0.7,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true
          })
        ])
      );
    });

    Animated.parallel(waveAnimation).start();
  };

  const startVoiceAnimation = () => {
    animationValues.forEach(anim => anim.stopAnimation());

    const animations = animationValues.map(anim => {
      return Animated.spring(anim, {
        toValue: 3,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      });
    });

    Animated.parallel(animations).start();
  };

  const startRecording = async () => {
    if (!hasPermission) {
      const granted = await checkPermission();
      if (!granted) return;
    }

    if (isRecording) {
      console.log('Recording is already in progress');
      return;
    }

    try {
      setShowSearch(false);
      setIsRecording(true); 
      setVoiceDetected(false);

      console.log('Starting recorder...');
      await audioRecorderPlayer.startRecorder(); 
      console.log('Recording started');

      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
      recordingTimeout.current = setTimeout(() => {
        console.log('15 seconds passed, stopping recording');
        stopRecording();
      }, 15000);

      if (initialSilenceTimer.current) {
        clearTimeout(initialSilenceTimer.current);
      }
      initialSilenceTimer.current = setTimeout(() => {
        if (!voiceDetected) {
          console.log('No voice detected in 5 seconds, stopping');
          stopRecording();
        }
      }, 5000);

      let consecutiveSilentReadings = 0;

      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Metering:', e.currentMetering);
        if (e.currentMetering > -20) {
          consecutiveSilentReadings = 0;
          if (!voiceDetected) {
            setVoiceDetected(true);
            startVoiceAnimation();
          }
        } else {
          consecutiveSilentReadings++;
          if (consecutiveSilentReadings > 10) {
            setVoiceDetected(false);
            startListeningAnimation();
          }
        }
      });
    } catch (error) {
      console.error('Recording failed:', error);
      setIsRecording(false); 
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
        recordingTimeout.current = null;
      }
      if (initialSilenceTimer.current) {
        clearTimeout(initialSilenceTimer.current);
        initialSilenceTimer.current = null;
      }

      if (isRecording) {
        console.log('Stopping recorder...');
        await audioRecorderPlayer.stopRecorder();
        console.log('Recording stopped');
        
        audioRecorderPlayer.removeRecordBackListener(); 
        setIsRecording(false);
        setVoiceDetected(false);
        setShowSearch(true);

        startListeningAnimation();
      }
    } catch (error) {
      console.error('Stop recording failed:', error);
    }
  };

  const handleBackPress = async () => {
    await cleanUp();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleButton} onPress={handleBackPress}>
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Globe Button */}
      <View style={styles.globeContainer}>
        <TouchableOpacity style={styles.circleButton}>
          <Text style={styles.buttonText}>🌐</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.statusText}>
          {!hasPermission ? 'Microphone not found.' : voiceDetected ? 'hello' : 'Listening...'}
        </Text>

        <View style={styles.dotsContainer}>
          {animationValues.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: dotColors[index],
                  transform: [{ scaleY: anim }]
                }
              ]}
            />
          ))}
        </View>

        {showSearch && (
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🎵 Search a song</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  globeContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#5F6368',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  statusText: {
    fontSize: 24,
    color: '#5F6368',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 24,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  searchButton: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F1F3F4',
  },
  searchButtonText: {
    fontSize: 16,
    color: '#5F6368',
  }
});

export default VoiceRecorderScreen;
