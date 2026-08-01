import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { formatSpeed } from '../utils/unitConverter';
import ReanimatedCard from './ReanimatedCard';

export default function WindCompassCard() {
  const { weatherData, unit } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.current) return null;

  const cur = weatherData.current;
  const speed = cur.wind_speed_10m || 0;
  const deg = cur.wind_direction_10m || 0;
  const gust = cur.wind_gusts_10m || 0;

  const getCompassDir = (d) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(d / 22.5) % 16];
  };

  return (
    <ReanimatedCard delay={450}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="weather-windy" size={20} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={[styles.titleText, { color: colors.textSecondary }]}>Wind & Direction</Text>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.compassWrapper}>
          <View style={[styles.compassCircle, { borderColor: colors.cardBorder, backgroundColor: colors.chipBg }]}>
            <Text style={[styles.cardinal, styles.north, { color: colors.textMuted }]}>N</Text>
            <Text style={[styles.cardinal, styles.east, { color: colors.textMuted }]}>E</Text>
            <Text style={[styles.cardinal, styles.south, { color: colors.textMuted }]}>S</Text>
            <Text style={[styles.cardinal, styles.west, { color: colors.textMuted }]}>W</Text>

            <View style={[styles.needle, { transform: [{ rotate: `${deg}deg` }] }]}>
              <MaterialCommunityIcons name="navigation" size={26} color="#EF4444" />
            </View>
          </View>
        </View>

        <View style={styles.detailsCol}>
          <View style={styles.mainSpeedRow}>
            <Text style={[styles.speedVal, { color: colors.textPrimary }]}>{formatSpeed(speed, unit)}</Text>
          </View>

          <Text style={[styles.directionText, { color: colors.textSecondary }]}>
            Direction: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{deg}° {getCompassDir(deg)}</Text>
          </Text>

          <View style={styles.gustBadge}>
            <MaterialCommunityIcons name="tailwind" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
            <Text style={styles.gustText}>Peak Gusts: {formatSpeed(gust, unit)}</Text>
          </View>
        </View>
      </View>
    </ReanimatedCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compassWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  compassCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardinal: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '800',
  },
  north: { top: 3 },
  east: { right: 5 },
  south: { bottom: 3 },
  west: { left: 5 },
  needle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCol: {
    flex: 1,
  },
  mainSpeedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  speedVal: {
    fontSize: 26,
    fontWeight: '900',
  },
  directionText: {
    fontSize: 13,
    marginTop: 4,
  },
  gustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  gustText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
});
