import axios from 'axios';

const OWM_API_KEY = '1fc7ef0f626b4b408bd727f99d7579de';

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
    const res = await axios.get(url);
    if (res.data && res.data.results) {
      return res.data.results.map(item => ({
        id: `${item.latitude}-${item.longitude}-${item.name}`,
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        lat: item.latitude,
        lon: item.longitude
      }));
    }
  } catch (error) {
    console.warn("Geocoding search error", error);
  }
  return [];
}

export async function reverseGeocode(lat, lon) {
  // Tier 1: OpenWeatherMap Direct Reverse Geocoding
  try {
    const owmUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_API_KEY}`;
    const owmRes = await axios.get(owmUrl).then(r => r.data).catch(() => null);
    if (owmRes && owmRes.length > 0) {
      const g = owmRes[0];
      return {
        name: g.name || "Current Location",
        country: g.country || "",
        admin1: g.state || "",
        lat,
        lon
      };
    }
  } catch (e) {
    console.warn("OWM reverse geocode skipped", e);
  }

  // Tier 2: Nominatim OSM
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const geoRes = await axios.get(url, { headers: { 'User-Agent': 'SkyPulseWeatherApp/2.0' } }).then(r => r.data).catch(() => null);
    if (geoRes && geoRes.address) {
      const addr = geoRes.address;
      const cityName = addr.village || addr.hamlet || addr.town || addr.city || addr.suburb || addr.neighbourhood || addr.municipality || addr.county || addr.district || addr.state || "Current Location";
      const countryName = addr.country || "";
      const admin1 = addr.state || addr.region || addr.county || "";
      return { name: cityName, country: countryName, admin1, lat, lon };
    }
  } catch (e) {
    console.warn("Nominatim reverse geocode failed", e);
  }

  // Tier 3: BigDataCloud
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const bdcRes = await axios.get(bdcUrl).then(r => r.data).catch(() => null);
    if (bdcRes) {
      const cityName = bdcRes.city || bdcRes.locality || bdcRes.localityInfo?.administrative?.[2]?.name || "Current Location";
      return { name: cityName, country: bdcRes.countryName || "", admin1: bdcRes.principalSubdivision || "", lat, lon };
    }
  } catch (e) {
    console.warn("BigDataCloud reverse geocode failed", e);
  }

  return { name: "Current Location", country: "", lat, lon };
}
