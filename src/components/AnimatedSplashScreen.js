import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedSplashScreen({ message = "Detecting location & fetching weather..." }) {
  const { colors } = useTheme();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
        <Ionicons name="partly-sunny" size={80} color={colors.accent} />
      </Animated.View>
      
      <Text style={[styles.title, { color: colors.textPrimary }]}>SkyPulse</Text>
      
      <Animated.Text style={[styles.subtitle, { color: colors.textSecondary }, animatedTextStyle]}>
        {message}
      </Animated.Text>
      
      <ActivityIndicator size="small" color={colors.accent} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginTop: 8,
  },
});
