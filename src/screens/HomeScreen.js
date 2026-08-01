import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { GRADIENTS } from '../constants/theme';
import { calculateTimePhase } from '../utils/dateHelpers';
import { getWeatherInfo } from '../constants/weatherCodes';
import CityChipList from '../components/CityChipList';
import WeatherHero from '../components/WeatherHero';
import HourlyForecastTrack from '../components/HourlyForecastTrack';
import Forecast7Day from '../components/Forecast7Day';
import AirQualityCard from '../components/AirQualityCard';
import WindCompassCard from '../components/WindCompassCard';
import SunArcCard from '../components/SunArcCard';
import UvIndexCard from '../components/UvIndexCard';
import ExtraMetricsGrid from '../components/ExtraMetricsGrid';
import LifestyleIndices from '../components/LifestyleIndices';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';
import OfflineBadge from '../components/OfflineBadge';

export default function HomeScreen() {
  const { weatherData, loading, currentLocation, detectDeviceLocation } = useWeather();
  const { colors, isDark } = useTheme();

  const phase = calculateTimePhase(weatherData, 'auto');
  let category = 'clear';

  if (weatherData && weatherData.current) {
    const info = getWeatherInfo(weatherData.current.weather_code, weatherData.current.is_day);
    category = info.category || 'clear';
  }

  // Dynamic gradient stops based on active theme & time of day
  const defaultGradient = isDark ? colors.gradientBackground : ['#E0F2FE', '#F1F5F9', '#CBD5E1'];
  const gradientStops = isDark
    ? ((GRADIENTS[phase] && GRADIENTS[phase][category]) || GRADIENTS.day.clear)
    : defaultGradient;

  if (loading && !weatherData) {
    return <AnimatedSplashScreen message="Detecting location & fetching live weather..." />;
  }

  return (
    <LinearGradient colors={gradientStops} style={styles.gradientBg}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={detectDeviceLocation}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Offline Cache Indicator Badge */}
        <OfflineBadge />

        {/* Quick Selection Chips (Kolkata, Delhi, London, Tokyo) */}
        <CityChipList />

        {/* Weather Hero Card */}
        <WeatherHero />

        {/* Hourly Forecast (24 Hours Horizontally Scrollable) */}
        <HourlyForecastTrack />

        {/* 7-Day Outlook */}
        <Forecast7Day />

        {/* Extra Telemetry & Environmental Cards */}
        <AirQualityCard />
        <WindCompassCard />
        <SunArcCard />
        <UvIndexCard />
        <ExtraMetricsGrid />
        <LifestyleIndices />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
});
