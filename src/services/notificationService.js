import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORAGE_KEY = '@app_daily_notification_enabled';

// Safe handler for foreground notifications
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log('Notification handler config skipped:', e?.message);
}

/**
 * Request notification permissions from device safely
 */
export async function requestNotificationPermission() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted for daily weather notification');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-weather', {
        name: 'Daily Weather Forecast',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#38BDF8',
      });
    }

    return true;
  } catch (err) {
    console.log('Notification permission request error:', err?.message);
    return false;
  }
}

/**
 * Schedule daily weather notification at 7:00 AM
 */
export async function scheduleDailyWeatherNotification(weatherData = null) {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return false;

    // Cancel existing scheduled local notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    let bodyText = "Check today's weather forecast before heading out!";
    if (weatherData && weatherData.current) {
      const city = weatherData.location?.name || 'your city';
      const temp = Math.round(weatherData.current.temperature_2m || weatherData.current.temp || 20);
      bodyText = `Good morning! Current temperature in ${city} is ${temp}°C. Have a great day ahead!`;
    }

    // Schedule local notification for 7:00 AM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '☀️ Daily Morning Weather Update',
        body: bodyText,
        sound: true,
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      },
    });

    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
    return true;
  } catch (error) {
    console.log('Error scheduling daily weather notification:', error?.message);
    return false;
  }
}

/**
 * Cancel daily weather notification
 */
export async function cancelDailyWeatherNotification() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false');
    return true;
  } catch (error) {
    console.log('Error cancelling weather notification:', error?.message);
    return false;
  }
}

/**
 * Check if notifications are enabled in AsyncStorage
 */
export async function isNotificationEnabled() {
  try {
    const val = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return val === 'true';
  } catch (e) {
    return false;
  }
}
