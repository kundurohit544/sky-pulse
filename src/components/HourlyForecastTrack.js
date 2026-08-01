import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { getWeatherInfo } from '../constants/weatherCodes';
import { formatTemp, getUnitSymbol } from '../utils/unitConverter';
import ReanimatedCard from './ReanimatedCard';

export default function HourlyForecastTrack() {
  const { weatherData, unit } = useWeather();
  const { colors } = useTheme();

  if (!weatherData || !weatherData.hourly) return null;

  const hourly = weatherData.hourly;
  const curTime = weatherData.current ? weatherData.current.time : null;

  let startIdx = 0;
  if (curTime && hourly.time) {
    const curHourStr = curTime.slice(0, 13);
    const idx = hourly.time.findIndex(t => t && t.startsWith(curHourStr));
    if (idx >= 0) startIdx = idx;
  }

  const hoursList = [];
  for (let i = 0; i < 24; i++) {
    const idx = startIdx + i;
    if (idx >= hourly.time.length) break;

    const timeStr = hourly.time[idx];
    const hourNum = timeStr.includes('T') ? timeStr.split('T')[1].split(':')[0] : `${idx}`;
    const timeLabel = i === 0 ? 'Now' : `${hourNum}:00`;
    const isDay = hourly.is_day ? hourly.is_day[idx] : 1;
    const weatherCode = hourly.weather_code[idx];
    const temp = hourly.temperature_2m[idx];
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;

    hoursList.push({
      id: timeStr,
      label: timeLabel,
      temp,
      isDay,
      weatherCode,
      precipProb,
    });
  }

  return (
    <ReanimatedCard delay={150}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="clock-outline" size={20} color={colors.accent} style={{ marginRight: 6 }} />
        <Text style={[styles.titleText, { color: colors.textSecondary }]}>24-Hour Forecast</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackScroll}>
        {hoursList.map((item, index) => {
          const info = getWeatherInfo(item.weatherCode, item.isDay);
          const isCurrent = index === 0;

          return (
            <View 
              key={`${item.id}-${index}`} 
              style={[
                styles.hourBox,
                { 
                  backgroundColor: isCurrent ? colors.accentLight : colors.chipBg,
                  borderColor: isCurrent ? colors.accent : colors.cardBorder,
                }
              ]}
            >
              <Text style={[styles.timeText, { color: isCurrent ? colors.accent : colors.textPrimary }]}>
                {item.label}
              </Text>

              <MaterialCommunityIcons
                name={info.iconName}
                size={32}
                color={item.isDay ? '#F59E0B' : '#818CF8'}
                style={styles.icon}
              />

              <Text style={[styles.tempText, { color: colors.textPrimary }]}>
                {formatTemp(item.temp, unit)}{getUnitSymbol(unit)}
              </Text>

              {item.precipProb > 5 ? (
                <View style={styles.rainBadge}>
                  <MaterialCommunityIcons name="water" size={12} color={colors.accent} />
                  <Text style={[styles.rainText, { color: colors.accent }]}>{item.precipProb}%</Text>
                </View>
              ) : (
                <View style={{ height: 16 }} />
              )}
            </View>
          );
        })}
      </ScrollView>
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
  trackScroll: {
    gap: 12,
    paddingRight: 8,
  },
  hourBox: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 74,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  icon: {
    marginVertical: 4,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rainText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
});
