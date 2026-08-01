import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { getWeatherInfo } from '../constants/weatherCodes';
import ReanimatedCard from './ReanimatedCard';

export default function LifestyleIndices() {
  const { weatherData } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.current) return null;

  const cur = weatherData.current;
  const temp = cur.temperature_2m || 20;
  const wind = cur.wind_speed_10m || 10;
  const precip = cur.precipitation || 0;
  const info = getWeatherInfo(cur.weather_code, cur.is_day);

  // Compute outdoor running score (0-100)
  let runScore = 90;
  if (temp > 30 || temp < 5) runScore -= 30;
  if (wind > 30) runScore -= 25;
  if (precip > 0) runScore -= 40;
  runScore = Math.max(10, Math.min(100, runScore));

  // Compute outdoor cycling score (0-100)
  let bikeScore = 88;
  if (wind > 25) bikeScore -= 35;
  if (precip > 0) bikeScore -= 45;
  if (temp > 35 || temp < 0) bikeScore -= 30;
  bikeScore = Math.max(10, Math.min(100, bikeScore));

  return (
    <ReanimatedCard delay={900}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="run-fast" size={20} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={[styles.titleText, { color: colors.textSecondary }]}>Lifestyle & Outdoor</Text>
      </View>

      <View style={styles.indicesList}>
        {/* Running Index */}
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="run" size={26} color="#22C55E" />
          <View style={styles.itemTextCol}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Outdoor Running</Text>
            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
              {runScore > 75 ? 'Great conditions for an outdoor run' : 'Moderate conditions for exercise'}
            </Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.scoreText, { color: colors.accent }]}>{runScore}/100</Text>
          </View>
        </View>

        {/* Cycling Index */}
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="bike" size={26} color={colors.accent} />
          <View style={styles.itemTextCol}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Cycling & Biking</Text>
            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
              {bikeScore > 70 ? 'Favorable wind and road conditions' : 'Breezy or damp conditions'}
            </Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.scoreText, { color: colors.accent }]}>{bikeScore}/100</Text>
          </View>
        </View>

        {/* Clothing / Outfit Advice */}
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="tshirt-crew-outline" size={26} color="#F59E0B" />
          <View style={styles.itemTextCol}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Clothing Recommendation</Text>
            <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{info.clothing}</Text>
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
    marginBottom: 14,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  indicesList: {
    gap: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
