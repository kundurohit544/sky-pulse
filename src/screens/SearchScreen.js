import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing 
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { searchCities } from '../api/locationApi';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { POPULAR_CITIES } from '../constants/popularCities';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const { loadWeatherData, detectDeviceLocation, locating, recentSearches, clearRecentSearches } = useWeather();
  const { colors } = useTheme();

  // Search bar animation shared values
  const inputBorderScale = useSharedValue(1);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim().length >= 2) {
      setSearching(true);
      const res = await searchCities(text);
      setResults(res);
      setSearching(false);
    } else {
      setResults([]);
    }
  };

  const handleSelectCity = (city) => {
    loadWeatherData(city);
    navigation.navigate('Home');
  };

  const onFocusInput = () => {
    inputBorderScale.value = withTiming(1.02, { duration: 200, easing: Easing.ease });
  };

  const onBlurInput = () => {
    inputBorderScale.value = withTiming(1.0, { duration: 200, easing: Easing.ease });
  };

  const animatedSearchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputBorderScale.value }],
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {/* Animated Search Bar */}
        <Animated.View 
          style={[
            styles.searchBarWrapper, 
            { 
              backgroundColor: colors.inputBg, 
              borderColor: colors.inputBorder,
              shadowColor: colors.shadowColor,
            },
            animatedSearchStyle
          ]}
        >
          <Ionicons name="search" size={20} color={colors.accent} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search city (e.g. Kolkata, Delhi, Tokyo)..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            autoFocus={false}
          />
          {query ? (
            <TouchableOpacity onPress={() => handleSearch('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      </View>

      {/* GPS Location Button */}
      <TouchableOpacity
        style={[
          styles.gpsBtn, 
          { backgroundColor: colors.accentLight, borderColor: colors.accent }
        ]}
        onPress={async () => {
          await detectDeviceLocation();
          navigation.navigate('Home');
        }}
        disabled={locating}
        activeOpacity={0.75}
      >
        {locating ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons name="location" size={18} color={colors.accent} />
        )}
        <Text style={[styles.gpsBtnText, { color: colors.accent }]}>
          {locating ? 'Detecting coordinates...' : 'Auto Detect My GPS Location'}
        </Text>
      </TouchableOpacity>

      {/* Main Content Area: Suggestions / Results / History */}
      {searching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Searching locations worldwide...
          </Text>
        </View>
      ) : query.length >= 2 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.resultItem, { borderBottomColor: colors.cardBorder }]} 
              onPress={() => handleSelectCity(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={22} color={colors.accent} />
              <View style={styles.resultTextCol}>
                <Text style={[styles.resultName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.resultSub, { color: colors.textSecondary }]}>
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No matching cities found for "{query}"
            </Text>
          }
        />
      ) : (
        <FlatList
          data={POPULAR_CITIES}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View>
              {/* Quick Search Chips */}
              <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
                Featured Cities
              </Text>
              <View style={styles.chipsWrap}>
                {['Kolkata', 'Delhi', 'London', 'Tokyo'].map((cityName) => (
                  <TouchableOpacity
                    key={cityName}
                    style={[styles.popularChip, { backgroundColor: colors.chipBg, borderColor: colors.cardBorder }]}
                    onPress={() => {
                      const found = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
                      handleSelectCity(found || { name: cityName, country: '', lat: 22.5726, lon: 88.3639 });
                    }}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="sparkles" size={13} color={colors.accent} style={{ marginRight: 6 }} />
                    <Text style={[styles.chipText, { color: colors.textPrimary }]}>{cityName}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Recent Searches */}
              {recentSearches && recentSearches.length > 0 && (
                <View style={styles.recentSectionHeader}>
                  <Text style={[styles.sectionHeader, { color: colors.textSecondary, marginTop: 0 }]}>
                    Recent Searches
                  </Text>
                  <TouchableOpacity onPress={clearRecentSearches} activeOpacity={0.7}>
                    <Text style={[styles.clearBtnText, { color: colors.accent }]}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              )}

              {recentSearches && recentSearches.length > 0 && (
                <View style={styles.chipsWrap}>
                  {recentSearches.map((name, i) => (
                    <TouchableOpacity
                      key={`${name}-${i}`}
                      style={[styles.historyChip, { backgroundColor: colors.chipBg, borderColor: colors.cardBorder }]}
                      onPress={() => {
                        const found = POPULAR_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
                        handleSelectCity(found || { name, country: '', lat: 35.6762, lon: 139.6503 });
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="time-outline" size={14} color={colors.accent} style={{ marginRight: 6 }} />
                      <Text style={[styles.chipText, { color: colors.textPrimary }]}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
                Popular Global Destinations
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.popularItem, 
                { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }
              ]} 
              onPress={() => handleSelectCity(item)}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons name="city-variant-outline" size={22} color={colors.accent} />
              <View style={styles.popularTextCol}>
                <Text style={[styles.popularName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.popularCountry, { color: colors.textSecondary }]}>
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
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
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
  },
  gpsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  centerContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  hintText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  resultTextCol: {
    marginLeft: 14,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultSub: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 10,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
  },
  popularTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '700',
  },
  popularCountry: {
    fontSize: 13,
    marginTop: 2,
  },
});
