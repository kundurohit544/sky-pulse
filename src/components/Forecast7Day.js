import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { getWeatherInfo } from '../constants/weatherCodes';
import { formatTemp } from '../utils/unitConverter';
import { formatDateDayName } from '../utils/dateHelpers';
import ReanimatedCard from './ReanimatedCard';

export default function Forecast7Day() {
  const { weatherData, unit } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.daily) return null;

  const daily = weatherData.daily;
  const daysList = [];

  for (let i = 0; i < daily.time.length; i++) {
    daysList.push({
      date: daily.time[i],
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      weatherCode: daily.weather_code[i],
      rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
    });
  }

  // Find min/max for scale bar rendering
  const globalMin = Math.min(...daily.temperature_2m_min);
  const globalMax = Math.max(...daily.temperature_2m_max);
  const tempRange = globalMax - globalMin || 1;

  return (
    <ReanimatedCard delay={250}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={[styles.titleText, { color: colors.textSecondary }]}>7-Day Forecast</Text>
      </View>

      <View style={styles.list}>
        {daysList.map((item, index) => {
          const info = getWeatherInfo(item.weatherCode, 1);
          const dayName = formatDateDayName(item.date);

          // Calculate bar offsets for visual temperature range
          const leftPercent = ((item.minTemp - globalMin) / tempRange) * 100;
          const barWidthPercent = Math.max(((item.maxTemp - item.minTemp) / tempRange) * 100, 15);

          return (
            <View key={item.date} style={styles.dayRow}>
              <Text style={[styles.dayNameText, { color: colors.textPrimary }]}>{dayName}</Text>

              <View style={styles.conditionCol}>
                <MaterialCommunityIcons name={info.iconName} size={22} color="#F59E0B" />
                {item.rainProb > 15 ? (
                  <Text style={[styles.rainPercent, { color: colors.accent }]}>{item.rainProb}%</Text>
                ) : null}
              </View>

              <Text style={[styles.minTempText, { color: colors.textMuted }]}>
                {formatTemp(item.minTemp, unit)}°
              </Text>

              {/* Temperature Visual Range Bar */}
              <View style={[styles.barContainer, { backgroundColor: colors.chipBg }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: colors.accent,
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.maxTempText, { color: colors.textPrimary }]}>
                {formatTemp(item.maxTemp, unit)}°
              </Text>
            </View>
          );
        })}
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
  list: {
    gap: 12,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dayNameText: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
  },
  conditionCol: {
    width: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rainPercent: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  minTempText: {
    width: 32,
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 3,
  },
  maxTempText: {
    width: 32,
    fontSize: 14,
    fontWeight: '700',
  },
});
