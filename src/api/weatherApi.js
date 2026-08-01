import axios from 'axios';

const OWM_API_KEY = '1fc7ef0f626b4b408bd727f99d7579de';

export async function fetchWeatherAndAQI(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
  const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;

  try {
    const [weatherRes, aqiRes, owmRes] = await Promise.all([
      axios.get(weatherUrl).then(r => r.data),
      axios.get(aqiUrl).then(r => r.data).catch(() => null),
      axios.get(owmUrl).then(r => r.data).catch(() => null)
    ]);

    // Enhance real-time metrics with OpenWeatherMap data if available
    if (owmRes && owmRes.main) {
      weatherRes.current.temperature_2m = owmRes.main.temp;
      weatherRes.current.apparent_temperature = owmRes.main.feels_like;
      weatherRes.current.relative_humidity_2m = owmRes.main.humidity;
      weatherRes.current.pressure_msl = owmRes.main.pressure;
      if (owmRes.wind) {
        weatherRes.current.wind_speed_10m = Math.round(owmRes.wind.speed * 3.6);
        weatherRes.current.wind_direction_10m = owmRes.wind.deg || weatherRes.current.wind_direction_10m;
        if (owmRes.wind.gust) weatherRes.current.wind_gusts_10m = Math.round(owmRes.wind.gust * 3.6);
      }
    }

    return {
      weather: weatherRes,
      aqi: aqiRes
    };
  } catch (error) {
    console.warn("Weather API fetch error, returning fallback structure", error);
    return getFallbackWeatherData();
  }
}

export function getFallbackWeatherData() {
  return {
    weather: {
      current: {
        temperature_2m: 22,
        apparent_temperature: 23,
        relative_humidity_2m: 55,
        wind_speed_10m: 12,
        wind_direction_10m: 140,
        wind_gusts_10m: 18,
        weather_code: 0,
        is_day: 1,
        pressure_msl: 1013,
        cloud_cover: 15,
        precipitation: 0
      },
      daily: {
        time: Array.from({ length: 7 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split('T')[0];
        }),
        weather_code: [0, 1, 2, 61, 3, 0, 1],
        temperature_2m_max: [24, 25, 23, 19, 21, 26, 27],
        temperature_2m_min: [15, 16, 14, 12, 13, 15, 17],
        precipitation_probability_max: [10, 20, 30, 80, 40, 10, 5],
        sunrise: Array(7).fill("2026-08-01T05:45"),
        sunset: Array(7).fill("2026-08-01T18:50"),
        uv_index_max: [6, 7, 5, 3, 4, 8, 8],
        wind_speed_10m_max: [14, 16, 12, 22, 18, 10, 12]
      },
      hourly: {
        time: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`),
        temperature_2m: Array.from({ length: 24 }, (_, i) => 15 + Math.sin(i / 3) * 8),
        precipitation_probability: Array.from({ length: 24 }, (_, i) => (i % 6) * 10),
        wind_speed_10m: Array.from({ length: 24 }, (_, i) => 10 + (i % 4) * 3),
        weather_code: Array(24).fill(0)
      }
    },
    aqi: {
      current: { us_aqi: 42, pm2_5: 10.2, pm10: 22.1, ozone: 35.0, nitrogen_dioxide: 14.5 }
    }
  };
}
