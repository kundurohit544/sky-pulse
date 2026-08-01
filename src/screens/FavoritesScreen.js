import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { POPULAR_CITIES } from '../constants/popularCities';
import ReanimatedCard from '../components/ReanimatedCard';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, loadWeatherData } = useWeather();
  const { colors } = useTheme();

  const handleSelectFav = (name) => {
    const found = POPULAR_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
    loadWeatherData(found || { name, country: '', lat: 22.5726, lon: 88.3639 });
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Favorite Locations</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Favorite Locations</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
            Tap the star icon on any city card to pin your favorite locations here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <ReanimatedCard delay={index * 80} style={styles.cardOverride}>
              <View style={styles.favCard}>
                <TouchableOpacity 
                  style={styles.cardMain} 
                  onPress={() => handleSelectFav(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location" size={24} color={colors.accent} />
                  <View style={styles.textGroup}>
                    <Text style={[styles.cityName, { color: colors.textPrimary }]}>{item}</Text>
                    <Text style={[styles.tapText, { color: colors.textSecondary }]}>Tap to view live weather</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteBtn} 
                  onPress={() => toggleFavorite(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </ReanimatedCard>
          )}
        />
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardOverride: {
    marginVertical: 4,
    padding: 14,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    marginLeft: 14,
  },
  cityName: {
    fontSize: 17,
    fontWeight: '700',
  },
  tapText: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
});
