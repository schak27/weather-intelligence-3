import { WeatherCodeInfo } from '../types/weather';

export function getWeatherCodeInfo(code: number, isDay: boolean = true): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        description: isDay ? 'Clear Sky' : 'Clear Night',
        icon: isDay ? 'Sun' : 'Moon',
        category: 'clear'
      };
    case 1:
      return {
        code,
        description: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'Moon',
        category: 'clear'
      };
    case 2:
      return {
        code,
        description: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'partly-cloudy'
      };
    case 3:
      return {
        code,
        description: 'Overcast',
        icon: 'Cloud',
        category: 'cloudy'
      };
    case 45:
      return {
        code,
        description: 'Foggy',
        icon: 'CloudFog',
        category: 'fog'
      };
    case 48:
      return {
        code,
        description: 'Depositing Rime Fog',
        icon: 'CloudFog',
        category: 'fog'
      };
    case 51:
      return {
        code,
        description: 'Light Drizzle',
        icon: 'CloudDrizzle',
        category: 'drizzle'
      };
    case 53:
      return {
        code,
        description: 'Moderate Drizzle',
        icon: 'CloudDrizzle',
        category: 'drizzle'
      };
    case 55:
      return {
        code,
        description: 'Dense Drizzle',
        icon: 'CloudDrizzle',
        category: 'drizzle'
      };
    case 56:
    case 57:
      return {
        code,
        description: 'Freezing Drizzle',
        icon: 'CloudHail',
        category: 'drizzle'
      };
    case 61:
      return {
        code,
        description: 'Slight Rain',
        icon: 'CloudRain',
        category: 'rain'
      };
    case 63:
      return {
        code,
        description: 'Moderate Rain',
        icon: 'CloudRain',
        category: 'rain'
      };
    case 65:
      return {
        code,
        description: 'Heavy Rain',
        icon: 'CloudRainWind',
        category: 'rain'
      };
    case 66:
    case 67:
      return {
        code,
        description: 'Freezing Rain',
        icon: 'CloudHail',
        category: 'rain'
      };
    case 71:
      return {
        code,
        description: 'Slight Snow Fall',
        icon: 'CloudSnow',
        category: 'snow'
      };
    case 73:
      return {
        code,
        description: 'Moderate Snow Fall',
        icon: 'CloudSnow',
        category: 'snow'
      };
    case 75:
      return {
        code,
        description: 'Heavy Snow Fall',
        icon: 'Snowflake',
        category: 'snow'
      };
    case 77:
      return {
        code,
        description: 'Snow Grains',
        icon: 'Snowflake',
        category: 'snow'
      };
    case 80:
      return {
        code,
        description: 'Slight Rain Showers',
        icon: 'CloudRain',
        category: 'rain'
      };
    case 81:
      return {
        code,
        description: 'Moderate Rain Showers',
        icon: 'CloudRain',
        category: 'rain'
      };
    case 82:
      return {
        code,
        description: 'Violent Rain Showers',
        icon: 'CloudRainWind',
        category: 'rain'
      };
    case 85:
    case 86:
      return {
        code,
        description: 'Snow Showers',
        icon: 'CloudSnow',
        category: 'snow'
      };
    case 95:
      return {
        code,
        description: 'Thunderstorm',
        icon: 'CloudLightning',
        category: 'thunderstorm'
      };
    case 96:
    case 99:
      return {
        code,
        description: 'Thunderstorm with Hail',
        icon: 'CloudLightning',
        category: 'thunderstorm'
      };
    default:
      return {
        code,
        description: 'Variable Weather',
        icon: 'Sun',
        category: 'clear'
      };
  }
}

export function getWindDirectionName(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUvIndexTier(uv: number): { label: string; color: string; advice: string } {
  if (uv < 3) {
    return {
      label: 'Low',
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
      advice: 'Minimal sun protection needed. Safe outdoors.'
    };
  } else if (uv < 6) {
    return {
      label: 'Moderate',
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
      advice: 'Wear sunglasses, apply SPF 30+ if out for >30 mins.'
    };
  } else if (uv < 8) {
    return {
      label: 'High',
      color: 'text-orange-400 bg-orange-950/40 border-orange-800/40',
      advice: 'Sunscreen, hat, and shade required during midday.'
    };
  } else if (uv < 11) {
    return {
      label: 'Very High',
      color: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
      advice: 'Avoid midday sun. Extra UV protection essential.'
    };
  } else {
    return {
      label: 'Extreme',
      color: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
      advice: 'Stay indoors around midday. Unprotected skin burns rapidly.'
    };
  }
}

export function getHumidityComfort(humidity: number): { label: string; description: string } {
  if (humidity < 30) {
    return { label: 'Dry', description: 'Air is dry. Consider moisturizer and hydration.' };
  } else if (humidity <= 60) {
    return { label: 'Comfortable', description: 'Optimal indoor and outdoor air moisture.' };
  } else if (humidity <= 75) {
    return { label: 'Humid', description: 'Noticeable moisture; feels warmer than actual.' };
  } else {
    return { label: 'Very Muggy', description: 'High oppressive moisture and perspiration delay.' };
  }
}

export function getPressureStatus(hPa: number): { label: string; trend: 'High' | 'Normal' | 'Low' } {
  if (hPa > 1018) {
    return { label: 'High Pressure (Clear/Stable)', trend: 'High' };
  } else if (hPa < 1008) {
    return { label: 'Low Pressure (Unsettled/Rain)', trend: 'Low' };
  } else {
    return { label: 'Standard Barometric Pressure', trend: 'Normal' };
  }
}
