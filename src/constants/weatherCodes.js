export const WEATHER_CODES = {
  0: {
    label: "Clear Sky",
    description: "Cloudless, bright clear sky",
    category: "clear",
    dayIcon: "weather-sunny",
    nightIcon: "weather-night",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Light t-shirt, sunglasses & sun protection",
    activity: "Perfect for outdoor sports, picnics & walking"
  },
  1: {
    label: "Mainly Clear",
    description: "Mostly clear with scattered high cloud patches",
    category: "clear",
    dayIcon: "weather-partly-cloudy",
    nightIcon: "weather-night-partly-cloudy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Casual comfortable attire, UV lotion",
    activity: "Great for sightseeing and cycling"
  },
  2: {
    label: "Partly Cloudy",
    description: "Intermittent sunshine with clouds",
    category: "cloudy",
    dayIcon: "weather-partly-cloudy",
    nightIcon: "weather-night-partly-cloudy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Light layered clothing",
    activity: "Good conditions for outdoor activities"
  },
  3: {
    label: "Overcast",
    description: "Dense cloud cover spanning the sky",
    category: "cloudy",
    dayIcon: "weather-cloudy",
    nightIcon: "weather-cloudy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Jacket or sweater recommended",
    activity: "Indoor fitness or casual walks"
  },
  45: {
    label: "Foggy",
    description: "Low visibility fog blanket",
    category: "fog",
    dayIcon: "weather-fog",
    nightIcon: "weather-fog",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Reflective outer layer, fog lights for driving",
    activity: "Exercise caution when driving or cycling"
  },
  48: {
    label: "Depositing Rime Fog",
    description: "Freezing fog depositing ice crystals",
    category: "fog",
    dayIcon: "weather-fog",
    nightIcon: "weather-fog",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Heavy insulated coat & gloves",
    activity: "Roadways may be slick, stay indoors"
  },
  51: {
    label: "Light Drizzle",
    description: "Fine light misting rain droplets",
    category: "rain",
    dayIcon: "weather-partly-rainy",
    nightIcon: "weather-partly-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Water-resistant windbreaker",
    activity: "Light jogging with rainwear"
  },
  53: {
    label: "Moderate Drizzle",
    description: "Steady fine rain mist",
    category: "rain",
    dayIcon: "weather-rainy",
    nightIcon: "weather-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Rain jacket & umbrella",
    activity: "Indoor leisure"
  },
  55: {
    label: "Dense Drizzle",
    description: "Heavy soaking drizzle mist",
    category: "rain",
    dayIcon: "weather-pouring",
    nightIcon: "weather-pouring",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Waterproof coat & boots",
    activity: "Indoor activities suggested"
  },
  61: {
    label: "Slight Rain",
    description: "Light intermittent rain showers",
    category: "rain",
    dayIcon: "weather-rainy",
    nightIcon: "weather-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Umbrella & raincoat",
    activity: "Short walks ok with umbrella"
  },
  63: {
    label: "Moderate Rain",
    description: "Continuous steady rainfall",
    category: "rain",
    dayIcon: "weather-pouring",
    nightIcon: "weather-pouring",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Raincoat, waterproof footwear & umbrella",
    activity: "Indoor entertainment"
  },
  65: {
    label: "Heavy Rain",
    description: "Torrential heavy rain downpour",
    category: "rain",
    dayIcon: "weather-lightning-rainy",
    nightIcon: "weather-lightning-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Heavy duty raincoat & boots",
    activity: "Avoid outdoor travel"
  },
  71: {
    label: "Slight Snow",
    description: "Light fluttering snow flurries",
    category: "snow",
    dayIcon: "weather-snowy",
    nightIcon: "weather-snowy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Warm coat, beanie & gloves",
    activity: "Enjoy winter walks"
  },
  73: {
    label: "Moderate Snow",
    description: "Steady snowfall accumulating",
    category: "snow",
    dayIcon: "weather-snowy-heavy",
    nightIcon: "weather-snowy-heavy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Insulated winter jacket & snow boots",
    activity: "Great for skiing & snowball fights"
  },
  75: {
    label: "Heavy Snow",
    description: "Dense blizzard-like snowfall",
    category: "snow",
    dayIcon: "weather-snowy-heavy",
    nightIcon: "weather-snowy-heavy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Thermal inner layers & heavy parkas",
    activity: "Stay warm indoors"
  },
  80: {
    label: "Light Rain Showers",
    description: "Brief passing rain showers",
    category: "rain",
    dayIcon: "weather-partly-rainy",
    nightIcon: "weather-partly-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Compact umbrella",
    activity: "Outdoor activities with cover"
  },
  81: {
    label: "Moderate Rain Showers",
    description: "Frequent passing downpours",
    category: "rain",
    dayIcon: "weather-rainy",
    nightIcon: "weather-rainy",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Rain jacket with hood",
    activity: "Indoor dining or museum"
  },
  82: {
    label: "Violent Rain Showers",
    description: "Sudden intense torrential rain",
    category: "rain",
    dayIcon: "weather-pouring",
    nightIcon: "weather-pouring",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Full waterproof gear",
    activity: "Seek immediate shelter"
  },
  95: {
    label: "Thunderstorm",
    description: "Electric lightning & thunder rumbles",
    category: "thunder",
    dayIcon: "weather-lightning",
    nightIcon: "weather-lightning",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Waterproof layers & non-conductive umbrella",
    activity: "Stay indoors away from windows"
  },
  96: {
    label: "Thunderstorm with Hail",
    description: "Severe storm with ice hail pellets",
    category: "thunder",
    dayIcon: "weather-hail",
    nightIcon: "weather-hail",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Heavy protective clothing",
    activity: "Take shelter immediately"
  },
  99: {
    label: "Heavy Hail Storm",
    description: "Violent thunderstorm with large hail",
    category: "thunder",
    dayIcon: "weather-hail",
    nightIcon: "weather-hail",
    iconFamily: "MaterialCommunityIcons",
    clothing: "Protective winter storm gear",
    activity: "Do not venture outdoors"
  }
};

export function getWeatherInfo(code, isDay = 1) {
  const info = WEATHER_CODES[code] || WEATHER_CODES[0];
  const iconName = isDay ? info.dayIcon : info.nightIcon;
  return {
    ...info,
    iconName
  };
}
