import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { fetchWeatherAndAQI } from '../api/weatherApi';
import { POPULAR_CITIES } from '../constants/popularCities';
import { formatTemp, getUnitSymbol } from '../utils/unitConverter';
import { getWeatherInfo } from '../constants/weatherCodes';
import ReanimatedCard from '../components/ReanimatedCard';

export default function CompareScreen() {
  const { currentLocation, weatherData, unit } = useWeather();
  const { colors } = useTheme();

  const [city1] = useState(currentLocation);
  const [city2, setCity2] = useState(POPULAR_CITIES[1]); // Default London
  const [weather2, setWeather2] = useState(null);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    loadCompareCity(city2);
  }, [city2]);

  const loadCompareCity = async (city) => {
    setLoading2(true);
    const data = await fetchWeatherAndAQI(city.lat, city.lon);
    setWeather2(data.weather);
    setLoading2(false);
  };

  const cur1 = weatherData ? weatherData.current : null;
  const cur2 = weather2 ? weather2.current : null;

  const info1 = cur1 ? getWeatherInfo(cur1.weather_code, cur1.is_day) : null;
  const info2 = cur2 ? getWeatherInfo(cur2.weather_code, cur2.is_day) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>City Comparison</Text>

      {/* City Selector Pills */}
      <View style={styles.selectorRow}>
        <View style={[styles.cityPill, { backgroundColor: colors.chipBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cityPillLabel, { color: colors.textSecondary }]}>City A</Text>
          <Text style={[styles.cityPillName, { color: colors.textPrimary }]}>{city1.name}</Text>
        </View>

        <Ionicons name="swap-horizontal" size={24} color={colors.accent} style={{ marginHorizontal: 8 }} />

        <TouchableOpacity
          style={[styles.cityPill, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}
          onPress={() => {
            const nextIdx = (POPULAR_CITIES.findIndex(c => c.name.toLowerCase() === city2.name.toLowerCase()) + 1) % POPULAR_CITIES.length;
            setCity2(POPULAR_CITIES[nextIdx]);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.cityPillLabel, { color: colors.accent }]}>City B (Tap to change)</Text>
          <Text style={[styles.cityPillName, { color: colors.textPrimary }]}>{city2.name}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Comparison Table */}
        <ReanimatedCard delay={100}>
          {/* Row 1: Temperature */}
          <View style={[styles.compareRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.col}>
              <Text style={[styles.tempNum, { color: colors.textPrimary }]}>
                {cur1 ? formatTemp(cur1.temperature_2m, unit) : '--'}{getUnitSymbol(unit)}
              </Text>
              <Text style={[styles.condText, { color: colors.textSecondary }]}>{info1 ? info1.label : '--'}</Text>
            </View>
            <View style={styles.labelCol}>
              <Ionicons name="thermometer-outline" size={20} color={colors.accent} />
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Temperature</Text>
            </View>
            <View style={styles.col}>
              {loading2 ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <>
                  <Text style={[styles.tempNum, { color: colors.textPrimary }]}>
                    {cur2 ? formatTemp(cur2.temperature_2m, unit) : '--'}{getUnitSymbol(unit)}
                  </Text>
                  <Text style={[styles.condText, { color: colors.textSecondary }]}>{info2 ? info2.label : '--'}</Text>
                </>
              )}
            </View>
          </View>

          {/* Row 2: Feels Like */}
          <View style={[styles.compareRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur1 ? formatTemp(cur1.apparent_temperature, unit) : '--'}{getUnitSymbol(unit)}
              </Text>
            </View>
            <View style={styles.labelCol}>
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Feels Like</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur2 ? formatTemp(cur2.apparent_temperature, unit) : '--'}{getUnitSymbol(unit)}
              </Text>
            </View>
          </View>

          {/* Row 3: Humidity */}
          <View style={[styles.compareRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur1 ? `${cur1.relative_humidity_2m}%` : '--'}
              </Text>
            </View>
            <View style={styles.labelCol}>
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Humidity</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur2 ? `${cur2.relative_humidity_2m}%` : '--'}
              </Text>
            </View>
          </View>

          {/* Row 4: Wind Speed */}
          <View style={[styles.compareRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur1 ? `${Math.round(cur1.wind_speed_10m)} km/h` : '--'}
              </Text>
            </View>
            <View style={styles.labelCol}>
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Wind Speed</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur2 ? `${Math.round(cur2.wind_speed_10m)} km/h` : '--'}
              </Text>
            </View>
          </View>

          {/* Row 5: Pressure */}
          <View style={styles.compareRow}>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur1 ? `${Math.round(cur1.pressure_msl)} hPa` : '--'}
              </Text>
            </View>
            <View style={styles.labelCol}>
              <Text style={[styles.labelText, { color: colors.textSecondary }]}>Pressure</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.valText, { color: colors.textPrimary }]}>
                {cur2 ? `${Math.round(cur2.pressure_msl)} hPa` : '--'}
              </Text>
            </View>
          </View>
        </ReanimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cityPill: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cityPillLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cityPillName: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  labelCol: {
    width: 110,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  tempNum: {
    fontSize: 22,
    fontWeight: '900',
  },
  condText: {
    fontSize: 12,
    marginTop: 2,
  },
  valText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
