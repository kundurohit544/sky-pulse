import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useWeather } from '../context/WeatherContext';

export default function OfflineBadge() {
  const { isOffline, lastUpdated, detectDeviceLocation } = useWeather();
  const { colors } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.badgeBg, borderColor: 'rgba(239, 68, 68, 0.3)' }
      ]}
    >
      <Ionicons name="cloud-offline-outline" size={16} color={colors.badgeText} style={styles.icon} />
      <Text style={[styles.text, { color: colors.badgeText }]}>
        Offline Mode {lastUpdated ? `(Cached at ${lastUpdated})` : '(Cached Weather)'}
      </Text>
      <TouchableOpacity
        onPress={detectDeviceLocation}
        activeOpacity={0.7}
        style={styles.retryBtn}
      >
        <Ionicons name="refresh-outline" size={14} color={colors.badgeText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  retryBtn: {
    padding: 2,
  },
});
