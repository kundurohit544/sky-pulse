import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import ReanimatedCard from './ReanimatedCard';

export default function UvIndexCard() {
  const { weatherData } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.daily) return null;

  const daily = weatherData.daily;
  const uvMax = daily.uv_index_max && daily.uv_index_max[0] !== undefined ? daily.uv_index_max[0] : 4;

  let level = 'Low';
  let color = '#22C55E';
  let advice = 'No protection required. Enjoy the outdoors.';

  if (uvMax >= 3 && uvMax < 6) {
    level = 'Moderate';
    color = '#EAB308';
    advice = 'Wear sunglasses & SPF 30+ sunscreen during midday.';
  } else if (uvMax >= 6 && uvMax < 8) {
    level = 'High';
    color = '#F97316';
    advice = 'Reduce time in the sun between 10 a.m. and 4 p.m.';
  } else if (uvMax >= 8 && uvMax < 11) {
    level = 'Very High';
    color = '#EF4444';
    advice = 'Extra protection needed. Seek shade during midday.';
  } else if (uvMax >= 11) {
    level = 'Extreme';
    color = '#A855F7';
    advice = 'Avoid sun exposure during peak hours.';
  }

  const fillPercent = Math.min(100, (uvMax / 12) * 100);

  return (
    <ReanimatedCard delay={650}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#F59E0B" style={{ marginRight: 6 }} />
          <Text style={[styles.titleText, { color: colors.textSecondary }]}>UV Index</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: `${color}25` }]}>
          <Text style={[styles.badgeText, { color }]}>{level}</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <Text style={[styles.uvNum, { color }]}>{Math.round(uvMax)}</Text>
        
        <View style={styles.gaugeContainer}>
          <View style={[styles.gaugeBg, { backgroundColor: colors.chipBg }]}>
            <View style={[styles.gaugeFill, { width: `${fillPercent}%`, backgroundColor: color }]} />
          </View>
          <Text style={[styles.adviceText, { color: colors.textSecondary }]}>{advice}</Text>
        </View>
      </View>
    </ReanimatedCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uvNum: {
    fontSize: 38,
    fontWeight: '900',
    marginRight: 16,
  },
  gaugeContainer: {
    flex: 1,
  },
  gaugeBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  adviceText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
