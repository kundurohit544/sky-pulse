import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function ReanimatedCard({ 
  children, 
  style, 
  delay = 0, 
  duration = 450, 
  translateYValue = 20,
  scaleValue = 0.96 
}) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(translateYValue);
  const scale = useSharedValue(scaleValue);

  useEffect(() => {
    opacity.value = withDelay(
      delay, 
      withTiming(1, { duration, easing: Easing.out(Easing.quad) })
    );
    translateY.value = withDelay(
      delay, 
      withTiming(0, { duration, easing: Easing.out(Easing.back(1.2)) })
    );
    scale.value = withDelay(
      delay, 
      withTiming(1, { duration, easing: Easing.out(Easing.quad) })
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadowColor,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
});
