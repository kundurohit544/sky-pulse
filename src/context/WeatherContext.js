import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchWeatherAndAQI } from '../api/weatherApi';
import { reverseGeocode } from '../api/locationApi';
import { POPULAR_CITIES } from '../constants/popularCities';
import { scheduleDailyWeatherNotification, cancelDailyWeatherNotification, isNotificationEnabled } from '../services/notificationService';

const WeatherContext = createContext();

const STORAGE_KEYS = {
  UNIT: '@skypulse_unit',
  FAVORITES: '@skypulse_favs',
  RECENTS: '@skypulse_recents',
  CACHE: '@skypulse_cached_weather',
  NOTIFICATIONS: '@skypulse_notifications_enabled',
};

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState('c'); // 'c' | 'f'
  const [favorites, setFavorites] = useState(['London', 'Tokyo', 'Kolkata', 'Delhi']);
  const [recentSearches, setRecentSearches] = useState(['Kolkata', 'Delhi', 'London', 'Tokyo']);
  
  const [currentLocation, setCurrentLocation] = useState(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  
  // Offline & permission state
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem(STORAGE_KEYS.UNIT);
      if (savedUnit) setUnit(savedUnit);

      const savedFavs = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecents = await AsyncStorage.getItem(STORAGE_KEYS.RECENTS);
      if (savedRecents) {
        setRecentSearches(JSON.parse(savedRecents));
      } else {
        setRecentSearches(['Kolkata', 'Delhi', 'London', 'Tokyo']);
      }

      const notifStatus = await isNotificationEnabled();
      setNotificationsEnabled(notifStatus);

      // Try loading cached weather first so UI appears immediately
      const cachedString = await AsyncStorage.getItem(STORAGE_KEYS.CACHE);
      if (cachedString) {
        try {
          const cachedObj = JSON.parse(cachedString);
          if (cachedObj && cachedObj.weatherData) {
            setWeatherData(cachedObj.weatherData);
            setAirQualityData(cachedObj.airQualityData);
            setCurrentLocation(cachedObj.location || POPULAR_CITIES[0]);
            setLastUpdated(cachedObj.updatedAt || null);
          }
        } catch (err) {
          console.log('Error parsing cache', err);
        }
      }
    } catch (e) {
      console.warn("Failed to load initial state from AsyncStorage", e);
    } finally {
      // Auto-detect GPS location on startup
      detectDeviceLocation();
    }
  };

  const toggleUnit = async (newUnit) => {
    setUnit(newUnit);
    await AsyncStorage.setItem(STORAGE_KEYS.UNIT, newUnit);
  };

  const addRecentSearch = async (cityName) => {
    if (!cityName || cityName === "Current Location") return;
    const filtered = recentSearches.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    const updated = [cityName, ...filtered].slice(0, 8);
    setRecentSearches(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.RECENTS);
  };

  const toggleFavorite = async (cityName) => {
    let updated;
    if (favorites.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      updated = favorites.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    } else {
      updated = [cityName, ...favorites];
    }
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  };

  const toggleNotifications = async (enable) => {
    if (enable) {
      const success = await scheduleDailyWeatherNotification({ current: weatherData?.current, location: currentLocation });
      if (success) setNotificationsEnabled(true);
      return success;
    } else {
      await cancelDailyWeatherNotification();
      setNotificationsEnabled(false);
      return true;
    }
  };

  const loadWeatherData = async (loc) => {
    setLoading(true);
    setCurrentLocation(loc);
    if (loc.name) addRecentSearch(loc.name);

    try {
      const data = await fetchWeatherAndAQI(loc.lat, loc.lon);
      
      if (data && data.weather) {
        setWeatherData(data.weather);
        setAirQualityData(data.aqi);
        setIsOffline(false);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdated(nowStr);

        // Cache the successful response
        const cachePayload = {
          location: loc,
          weatherData: data.weather,
          airQualityData: data.aqi,
          updatedAt: nowStr,
        };
        await AsyncStorage.setItem(STORAGE_KEYS.CACHE, JSON.stringify(cachePayload));

        // If notifications are enabled, reschedule with updated weather
        if (notificationsEnabled) {
          scheduleDailyWeatherNotification({ current: data.weather.current, location: loc });
        }
      }
    } catch (error) {
      console.warn("Weather fetch failed, falling back to cache if available", error);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const detectDeviceLocation = async () => {
    setLocating(true);
    setPermissionDenied(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const geoLoc = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
        await loadWeatherData(geoLoc);
      } else {
        console.log("Location permission denied, allowing manual search");
        setPermissionDenied(true);
        // Fallback to Kolkata or default city if no data yet
        if (!weatherData) {
          await loadWeatherData(POPULAR_CITIES[0]);
        }
      }
    } catch (e) {
      console.warn("GPS location detection error", e);
      setPermissionDenied(true);
      if (!weatherData) {
        await loadWeatherData(POPULAR_CITIES[0]);
      }
    } finally {
      setLocating(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        favorites,
        recentSearches,
        currentLocation,
        weatherData,
        airQualityData,
        loading,
        locating,
        isOffline,
        lastUpdated,
        permissionDenied,
        notificationsEnabled,
        toggleUnit,
        toggleFavorite,
        addRecentSearch,
        clearRecentSearches,
        toggleNotifications,
        loadWeatherData,
        detectDeviceLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
