import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import ReanimatedCard from './ReanimatedCard';

export default function SunArcCard() {
  const { weatherData } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.daily) return null;

  const daily = weatherData.daily;
  const sunriseStr = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].split('T')[1] : '06:00';
  const sunsetStr = daily.sunset && daily.sunset[0] ? daily.sunset[0].split('T')[1] : '18:30';

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const [srH, srM] = sunriseStr.split(':').map(Number);
  const [ssH, ssM] = sunsetStr.split(':').map(Number);

  const srMins = srH * 60 + srM;
  const ssMins = ssH * 60 + ssM;
  const totalDaylightMins = Math.max(1, ssMins - srMins);

  let progress = 0;
  if (currentMins >= srMins && currentMins <= ssMins) {
    progress = Math.min(100, Math.max(0, ((currentMins - srMins) / totalDaylightMins) * 100));
  } else if (currentMins > ssMins) {
    progress = 100;
  }

  const daylightHours = Math.floor(totalDaylightMins / 60);
  const daylightMinutes = totalDaylightMins % 60;

  return (
    <ReanimatedCard delay={550}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="weather-sunset-up" size={20} color="#F59E0B" style={{ marginRight: 6 }} />
        <Text style={[styles.titleText, { color: colors.textSecondary }]}>Sunrise & Sunset</Text>
      </View>

      <View style={styles.timesRow}>
        <View style={styles.timeItem}>
          <MaterialCommunityIcons name="weather-sunset-up" size={26} color="#F59E0B" />
          <View style={styles.timeTextGroup}>
            <Text style={[styles.timeLabel, { color: colors.textMuted }]}>Sunrise</Text>
            <Text style={[styles.timeVal, { color: colors.textPrimary }]}>{sunriseStr}</Text>
          </View>
        </View>

        <View style={styles.timeItem}>
          <MaterialCommunityIcons name="weather-sunset-down" size={26} color="#F97316" />
          <View style={styles.timeTextGroup}>
            <Text style={[styles.timeLabel, { color: colors.textMuted }]}>Sunset</Text>
            <Text style={[styles.timeVal, { color: colors.textPrimary }]}>{sunsetStr}</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar representing daylight */}
      <View style={styles.barWrapper}>
        <View style={[styles.barBg, { backgroundColor: colors.chipBg }]}>
          <View style={[styles.barFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Text style={[styles.daylightText, { color: colors.textSecondary }]}>
        Daylight Duration: {daylightHours}h {daylightMinutes}m
      </Text>
    </ReanimatedCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  timesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTextGroup: {
    marginLeft: 8,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  barWrapper: {
    marginVertical: 8,
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  daylightText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});
