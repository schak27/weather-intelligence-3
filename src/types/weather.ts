export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherCodeInfo {
  code: number;
  description: string;
  icon: string; // lucide icon identifier
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
}

export interface HourlyPoint {
  time: string;
  formattedTime: string;
  timestamp: number;
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windGusts: number;
  uvIndex: number;
  visibility?: number;
  isDay?: boolean;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windDirectionDominant: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyForecast[];
  unitSystem: UnitSystem;
  lastUpdated: string;
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  category: 'activity' | 'wardrobe' | 'commute' | 'health' | 'home';
  score?: number; // 0 - 100
  status: 'optimal' | 'moderate' | 'caution' | 'warning';
  summary: string;
  details: string[];
  icon: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'info' | 'moderate' | 'severe';
  title: string;
  description: string;
  recommendation: string;
}
