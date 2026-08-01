import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import ReanimatedCard from './ReanimatedCard';

export default function AirQualityCard() {
  const { airQualityData } = useWeather();
  const { colors } = useTheme();

  if (!airQualityData || !airQualityData.current) return null;

  const cur = airQualityData.current;
  const aqi = cur.us_aqi !== undefined ? cur.us_aqi : 45;

  let status = 'Good';
  let color = '#22C55E';
  let advice = 'Air quality is satisfactory and poses little or no risk.';

  if (aqi > 50 && aqi <= 100) {
    status = 'Moderate';
    color = '#EAB308';
    advice = 'Air quality is acceptable for most people.';
  } else if (aqi > 100 && aqi <= 150) {
    status = 'Sensitive Groups';
    color = '#F97316';
    advice = 'Sensitive individuals may experience minor irritation.';
  } else if (aqi > 150 && aqi <= 200) {
    status = 'Unhealthy';
    color = '#EF4444';
    advice = 'Everyone may begin to experience adverse health effects.';
  } else if (aqi > 200) {
    status = 'Very Unhealthy';
    color = '#A855F7';
    advice = 'Health warnings of emergency conditions.';
  }

  return (
    <ReanimatedCard delay={350}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <MaterialCommunityIcons name="molecule-co2" size={20} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={[styles.titleText, { color: colors.textSecondary }]}>Air Quality (AQI)</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: `${color}25` }]}>
          <Text style={[styles.statusText, { color }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.aqiRow}>
        <View style={styles.aqiNumberContainer}>
          <Text style={[styles.aqiNum, { color }]}>{Math.round(aqi)}</Text>
          <Text style={[styles.aqiLabel, { color: colors.textMuted }]}>US AQI</Text>
        </View>

        <View style={[styles.adviceBox, { backgroundColor: colors.chipBg }]}>
          <Text style={[styles.adviceText, { color: colors.textSecondary }]}>{advice}</Text>
        </View>
      </View>

      <View style={[styles.pollutantsGrid, { backgroundColor: colors.chipBg }]}>
        <View style={styles.pollutantItem}>
          <Text style={[styles.pollutantName, { color: colors.textMuted }]}>PM2.5</Text>
          <Text style={[styles.pollutantVal, { color: colors.textPrimary }]}>{cur.pm2_5 ? Math.round(cur.pm2_5) : '--'} μg/m³</Text>
        </View>
        <View style={styles.pollutantItem}>
          <Text style={[styles.pollutantName, { color: colors.textMuted }]}>PM10</Text>
          <Text style={[styles.pollutantVal, { color: colors.textPrimary }]}>{cur.pm10 ? Math.round(cur.pm10) : '--'} μg/m³</Text>
        </View>
        <View style={styles.pollutantItem}>
          <Text style={[styles.pollutantName, { color: colors.textMuted }]}>O3</Text>
          <Text style={[styles.pollutantVal, { color: colors.textPrimary }]}>{cur.ozone ? Math.round(cur.ozone) : '--'} μg/m³</Text>
        </View>
        <View style={styles.pollutantItem}>
          <Text style={[styles.pollutantName, { color: colors.textMuted }]}>NO2</Text>
          <Text style={[styles.pollutantVal, { color: colors.textPrimary }]}>{cur.nitrogen_dioxide ? Math.round(cur.nitrogen_dioxide) : '--'} μg/m³</Text>
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
    marginBottom: 12,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  aqiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aqiNumberContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  aqiNum: {
    fontSize: 38,
    fontWeight: '900',
  },
  aqiLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  adviceBox: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
  },
  adviceText: {
    fontSize: 13,
    lineHeight: 18,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 12,
  },
  pollutantItem: {
    alignItems: 'center',
  },
  pollutantName: {
    fontSize: 11,
    fontWeight: '600',
  },
  pollutantVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
