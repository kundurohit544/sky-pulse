import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { POPULAR_CITIES } from '../constants/popularCities';

export default function CityChipList() {
  const { currentLocation, loadWeatherData, detectDeviceLocation, locating } = useWeather();
  const { colors } = useTheme();

  const primaryCities = ['Kolkata', 'Delhi', 'London', 'Tokyo'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* GPS Live Location Chip */}
        <TouchableOpacity
          style={[
            styles.chip,
            { backgroundColor: colors.accentLight, borderColor: colors.accent }
          ]}
          onPress={detectDeviceLocation}
          disabled={locating}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={14} color={colors.accent} style={styles.icon} />
          <Text style={[styles.chipTextActive, { color: colors.accent }]}>
            {locating ? 'Locating...' : 'GPS'}
          </Text>
        </TouchableOpacity>

        {primaryCities.map((cityName) => {
          const isActive = currentLocation && currentLocation.name.toLowerCase() === cityName.toLowerCase();
          const cityObj = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());

          return (
            <TouchableOpacity
              key={cityName}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.accentLight : colors.chipBg,
                  borderColor: isActive ? colors.accent : colors.cardBorder,
                }
              ]}
              onPress={() => {
                if (cityObj) loadWeatherData(cityObj);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location-outline"
                size={14}
                color={isActive ? colors.accent : colors.iconColor}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? colors.accent : colors.textPrimary, fontWeight: isActive ? '700' : '600' }
                ]}
              >
                {cityName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
  },
  chipTextActive: {
    fontSize: 13,
    fontWeight: '700',
  },
});
