import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  Easing 
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { getWeatherInfo } from '../constants/weatherCodes';
import { formatTemp, getUnitSymbol } from '../utils/unitConverter';

export default function WeatherHero() {
  const { currentLocation, weatherData, unit, favorites, toggleFavorite, locating, detectDeviceLocation } = useWeather();
  const { colors } = useTheme();

  const tempScale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const cur = weatherData?.current;
  const daily = weatherData?.daily;
  const info = cur ? getWeatherInfo(cur.weather_code, cur.is_day) : { iconName: 'weather-sunny', label: 'Clear' };
  const isFav = currentLocation?.name ? favorites.includes(currentLocation.name) : false;

  const highTemp = daily?.temperature_2m_max ? formatTemp(daily.temperature_2m_max[0], unit) : '--';
  const lowTemp = daily?.temperature_2m_min ? formatTemp(daily.temperature_2m_min[0], unit) : '--';

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    tempScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [cur?.temperature_2m, currentLocation?.name]);

  const animatedTempStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: tempScale.value }],
  }));

  if (!cur) return null;

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      {/* Header Row: Location Title, GPS Refresh & Favorite Button */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <TouchableOpacity 
            style={styles.titleWithIcon}
            onPress={detectDeviceLocation}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="map-marker" size={22} color={colors.accent} style={{ marginRight: 4 }} />
            <Text style={[styles.cityName, { color: colors.textPrimary }]}>{currentLocation.name}</Text>
            {locating && (
              <Ionicons name="refresh-circle" size={18} color={colors.accent} style={styles.gpsSpinner} />
            )}
          </TouchableOpacity>
          {currentLocation.country ? (
            <Text style={[styles.countryBadge, { color: colors.textSecondary }]}>
              {currentLocation.country} {currentLocation.admin1 ? `• ${currentLocation.admin1}` : ''}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.favBtn, { backgroundColor: colors.chipBg }]}
          onPress={() => toggleFavorite(currentLocation.name)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isFav ? 'star' : 'star-outline'}
            size={24}
            color={isFav ? '#F59E0B' : colors.iconColor}
          />
        </TouchableOpacity>
      </View>

      {/* Hero Temperature & Condition Icon with Reanimated */}
      <Animated.View style={[styles.mainTempRow, animatedTempStyle]}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={info.iconName}
            size={84}
            color={cur.is_day ? '#F59E0B' : '#818CF8'}
          />
        </View>

        <View style={styles.tempTextContainer}>
          <View style={styles.degreeRow}>
            <Text style={[styles.tempVal, { color: colors.textPrimary }]}>
              {formatTemp(cur.temperature_2m, unit)}
            </Text>
            <Text style={[styles.unitSymbol, { color: colors.accent }]}>{getUnitSymbol(unit)}</Text>
          </View>
          <Text style={[styles.conditionText, { color: colors.textSecondary }]}>{info.label}</Text>
        </View>
      </Animated.View>

      {/* Sub-metrics Pills */}
      <View style={[styles.statsRow, { backgroundColor: colors.chipBg }]}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="arrow-up-thin" size={18} color="#EF4444" />
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>High: </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {highTemp}{getUnitSymbol(unit)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="arrow-down-thin" size={18} color="#3B82F6" />
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Low: </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {lowTemp}{getUnitSymbol(unit)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="thermometer" size={18} color={colors.accent} />
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Feels: </Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {formatTemp(cur.apparent_temperature, unit)}{getUnitSymbol(unit)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28,
    padding: 22,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  gpsSpinner: {
    marginLeft: 6,
  },
  countryBadge: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  favBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempTextContainer: {
    alignItems: 'flex-end',
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempVal: {
    fontSize: 66,
    fontWeight: '900',
    lineHeight: 70,
  },
  unitSymbol: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 6,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 18,
  },
});
