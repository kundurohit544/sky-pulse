import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import ReanimatedCard from './ReanimatedCard';

export default function ExtraMetricsGrid() {
  const { weatherData } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.current) return null;

  const cur = weatherData.current;
  const humidity = cur.relative_humidity_2m || 0;
  const pressure = cur.pressure_msl || 1013;
  const visibility = 10; // Default 10km

  return (
    <View style={styles.grid}>
      {/* Humidity Card */}
      <ReanimatedCard delay={700} style={styles.gridCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="water-percent" size={20} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Humidity</Text>
        </View>
        <Text style={[styles.mainVal, { color: colors.textPrimary }]}>{humidity}%</Text>
        <Text style={[styles.subDesc, { color: colors.textMuted }]}>
          {humidity > 70 ? 'High moisture level' : (humidity < 30 ? 'Dry air condition' : 'Comfortable moisture')}
        </Text>
      </ReanimatedCard>

      {/* Pressure Card */}
      <ReanimatedCard delay={750} style={styles.gridCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="gauge" size={20} color="#A855F7" />
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Pressure</Text>
        </View>
        <Text style={[styles.mainVal, { color: colors.textPrimary }]}>
          {Math.round(pressure)} <Text style={[styles.unitText, { color: colors.textMuted }]}>hPa</Text>
        </Text>
        <Text style={[styles.subDesc, { color: colors.textMuted }]}>
          {pressure > 1013 ? 'High pressure system' : 'Low pressure system'}
        </Text>
      </ReanimatedCard>

      {/* Visibility Card */}
      <ReanimatedCard delay={800} style={styles.gridCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="eye-outline" size={20} color="#22C55E" />
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Visibility</Text>
        </View>
        <Text style={[styles.mainVal, { color: colors.textPrimary }]}>
          {visibility} <Text style={[styles.unitText, { color: colors.textMuted }]}>km</Text>
        </Text>
        <Text style={[styles.subDesc, { color: colors.textMuted }]}>Clear distance view</Text>
      </ReanimatedCard>

      {/* Cloud Cover Card */}
      <ReanimatedCard delay={850} style={styles.gridCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="weather-cloudy" size={20} color="#F59E0B" />
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Cloud Cover</Text>
        </View>
        <Text style={[styles.mainVal, { color: colors.textPrimary }]}>{cur.cloud_cover || 15}%</Text>
        <Text style={[styles.subDesc, { color: colors.textMuted }]}>Sky cloud coverage</Text>
      </ReanimatedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  gridCard: {
    width: '48%',
    marginVertical: 4,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  mainVal: {
    fontSize: 22,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 13,
    fontWeight: '500',
  },
  subDesc: {
    fontSize: 11,
    marginTop: 4,
  },
});
