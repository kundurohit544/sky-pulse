import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import ReanimatedCard from '../components/ReanimatedCard';

export default function SettingsScreen() {
  const { 
    unit, 
    toggleUnit, 
    notificationsEnabled, 
    toggleNotifications,
    clearRecentSearches,
    detectDeviceLocation 
  } = useWeather();

  const { themeMode, setThemeMode, colors } = useTheme();

  const themeOptions = [
    { mode: 'system', label: 'System Theme (Auto Detect)', icon: 'hardware-chip-outline' },
    { mode: 'light', label: 'Light Mode', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Dark Mode', icon: 'moon-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Settings & Preferences</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Theme Mode Selection */}
        <ReanimatedCard delay={50}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>App Appearance & Theme</Text>
          </View>

          {themeOptions.map((item) => {
            const isActive = themeMode === item.mode;
            return (
              <TouchableOpacity
                key={item.mode}
                style={[
                  styles.optionRow,
                  { 
                    backgroundColor: isActive ? colors.accentLight : 'transparent',
                    borderColor: isActive ? colors.accent : colors.cardBorder
                  }
                ]}
                onPress={() => setThemeMode(item.mode)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={isActive ? colors.accent : colors.iconColor} 
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.optionText, { color: isActive ? colors.accent : colors.textPrimary, fontWeight: isActive ? '700' : '500' }]}>
                    {item.label}
                  </Text>
                </View>
                {isActive && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                )}
              </TouchableOpacity>
            );
          })}
        </ReanimatedCard>

        {/* Daily 7:00 AM Notification Toggle */}
        <ReanimatedCard delay={150}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Daily Weather Alert</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>
                7:00 AM Morning Forecast
              </Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                Automatically receive today's temperature and weather summary every morning.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.chipBg, true: colors.accent }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </ReanimatedCard>

        {/* Temperature Unit Toggle */}
        <ReanimatedCard delay={250}>
          <View style={styles.sectionHeader}>
            <Ionicons name="thermometer-outline" size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Temperature Unit</Text>
          </View>

          <View style={[styles.toggleRow, { backgroundColor: colors.chipBg }]}>
            <TouchableOpacity
              style={[
                styles.unitBtn, 
                unit === 'c' && { backgroundColor: colors.accent }
              ]}
              onPress={() => toggleUnit('c')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, { color: unit === 'c' ? '#FFFFFF' : colors.textSecondary }]}>
                Celsius (°C)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.unitBtn, 
                unit === 'f' && { backgroundColor: colors.accent }
              ]}
              onPress={() => toggleUnit('f')}
              activeOpacity={0.8}
            >
              <Text style={[styles.unitBtnText, { color: unit === 'f' ? '#FFFFFF' : colors.textSecondary }]}>
                Fahrenheit (°F)
              </Text>
            </TouchableOpacity>
          </View>
        </ReanimatedCard>

        {/* Data & Permissions Management */}
        <ReanimatedCard delay={350}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Location & Storage</Text>
          </View>

          <TouchableOpacity 
            style={[styles.actionBtn, { borderColor: colors.cardBorder }]}
            onPress={detectDeviceLocation}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
              Re-Detect GPS Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { borderColor: colors.cardBorder, marginTop: 8 }]}
            onPress={clearRecentSearches}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>
              Clear Recent Search History
            </Text>
          </TouchableOpacity>
        </ReanimatedCard>

        {/* App Info Footer */}
        <View style={styles.footerInfo}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            SkyPulse Mobile App v2.0 • Powered by Expo & Open-Meteo
          </Text>
        </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginVertical: 4,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  switchDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  unitBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
