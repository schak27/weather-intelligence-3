import { GeoLocation, WeatherData, UnitSystem, DailyForecast, HourlyPoint } from '../types/weather';

export const DEFAULT_LOCATIONS: GeoLocation[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country_code: 'US',
    country: 'United States',
    admin1: 'New York',
    timezone: 'America/New_York'
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country_code: 'GB',
    country: 'United Kingdom',
    admin1: 'England',
    timezone: 'Europe/London'
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country_code: 'JP',
    country: 'Japan',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo'
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country_code: 'FR',
    country: 'France',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris'
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country_code: 'AU',
    country: 'Australia',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney'
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0772,
    longitude: 55.3093,
    country_code: 'AE',
    country: 'United Arab Emirates',
    admin1: 'Dubai',
    timezone: 'Asia/Dubai'
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country_code: 'US',
    country: 'United States',
    admin1: 'California',
    timezone: 'America/Los_Angeles'
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.2897,
    longitude: 103.8501,
    country_code: 'SG',
    country: 'Singapore',
    admin1: 'Central Singapore',
    timezone: 'Asia/Singapore'
  }
];

export async function searchCities(query: string): Promise<GeoLocation[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding request failed with status: ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code || '',
      country: item.country || '',
      admin1: item.admin1 || '',
      admin2: item.admin2 || '',
      timezone: item.timezone || 'UTC',
      population: item.population
    }));
  } catch (err) {
    console.error('Failed to search cities:', err);
    return [];
  }
}

export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Math.round(lat * 1000 + lon * 1000),
        name: cityName,
        latitude: lat,
        longitude: lon,
        country_code: data.countryCode || '',
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
    }
  } catch {
    // ignore, fall back
  }

  return {
    id: Math.round(lat * 1000 + lon * 1000),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country_code: '',
    country: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
  };
}

export async function fetchWeatherData(
  location: GeoLocation,
  unitSystem: UnitSystem = 'metric'
): Promise<WeatherData> {
  const { latitude, longitude } = location;
  const tempUnit = unitSystem === 'imperial' ? 'fahrenheit' : 'celsius';
  const windUnit = unitSystem === 'imperial' ? 'mph' : 'kmh';
  const precipUnit = unitSystem === 'imperial' ? 'inch' : 'mm';

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_gusts_10m',
      'uv_index',
      'visibility'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    timezone: 'auto',
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
    precipitation_unit: precipUnit
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API returned error status ${res.status}`);
  }

  const raw = await res.json();

  // Process Current
  const current = {
    time: raw.current.time,
    temperature: Math.round(raw.current.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(raw.current.apparent_temperature * 10) / 10,
    relativeHumidity: raw.current.relative_humidity_2m,
    isDay: Boolean(raw.current.is_day),
    precipitation: raw.current.precipitation || 0,
    rain: raw.current.rain || 0,
    showers: raw.current.showers || 0,
    snowfall: raw.current.snowfall || 0,
    weatherCode: raw.current.weather_code,
    cloudCover: raw.current.cloud_cover,
    pressureMsl: Math.round(raw.current.pressure_msl),
    surfacePressure: Math.round(raw.current.surface_pressure),
    windSpeed: Math.round(raw.current.wind_speed_10m * 10) / 10,
    windDirection: raw.current.wind_direction_10m,
    windGusts: Math.round(raw.current.wind_gusts_10m * 10) / 10,
    uvIndex: Math.round((raw.current.uv_index || 0) * 10) / 10
  };

  // Process Hourly (we format next 48-72 hours)
  const hourlyTimes: string[] = raw.hourly.time || [];
  const hourly: HourlyPoint[] = hourlyTimes.slice(0, 72).map((isoTime: string, idx: number) => {
    const dateObj = new Date(isoTime);
    const hour = dateObj.getHours();
    const formattedTime = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

    return {
      time: isoTime,
      formattedTime,
      timestamp: dateObj.getTime(),
      temperature: Math.round(raw.hourly.temperature_2m[idx] * 10) / 10,
      relativeHumidity: raw.hourly.relative_humidity_2m[idx],
      precipitationProbability: raw.hourly.precipitation_probability[idx] || 0,
      precipitation: raw.hourly.precipitation[idx] || 0,
      weatherCode: raw.hourly.weather_code[idx],
      windSpeed: Math.round(raw.hourly.wind_speed_10m[idx] * 10) / 10,
      windGusts: Math.round(raw.hourly.wind_gusts_10m[idx] * 10) / 10,
      uvIndex: Math.round((raw.hourly.uv_index?.[idx] || 0) * 10) / 10,
      visibility: raw.hourly.visibility?.[idx]
    };
  });

  // Process Daily 7-day outlook
  const dailyDates: string[] = raw.daily.time || [];
  const daily: DailyForecast[] = dailyDates.slice(0, 7).map((dateStr: string, idx: number) => {
    const dateObj = new Date(`${dateStr}T00:00:00`);
    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode: raw.daily.weather_code[idx],
      temperatureMax: Math.round(raw.daily.temperature_2m_max[idx]),
      temperatureMin: Math.round(raw.daily.temperature_2m_min[idx]),
      apparentTemperatureMax: Math.round(raw.daily.apparent_temperature_max[idx]),
      apparentTemperatureMin: Math.round(raw.daily.apparent_temperature_min[idx]),
      sunrise: raw.daily.sunrise[idx],
      sunset: raw.daily.sunset[idx],
      uvIndexMax: Math.round(raw.daily.uv_index_max[idx] * 10) / 10,
      precipitationSum: Math.round((raw.daily.precipitation_sum[idx] || 0) * 10) / 10,
      precipitationProbabilityMax: raw.daily.precipitation_probability_max[idx] || 0,
      windSpeedMax: Math.round(raw.daily.wind_speed_10m_max[idx] * 10) / 10,
      windDirectionDominant: raw.daily.wind_direction_10m_dominant[idx] || 0
    };
  });

  return {
    location,
    current,
    hourly,
    daily,
    unitSystem,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
