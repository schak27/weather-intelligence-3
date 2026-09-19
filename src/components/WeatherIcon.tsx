import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Snowflake,
  CloudHail,
  CloudLightning,
  SunMedium,
  Wind
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = 'w-6 h-6',
  size
}) => {
  const info = getWeatherCodeInfo(code, isDay);

  const getIcon = () => {
    switch (info.icon) {
      case 'Sun':
        return <Sun size={size} className={`${className} text-amber-400`} />;
      case 'SunMedium':
        return <SunMedium size={size} className={`${className} text-amber-400`} />;
      case 'Moon':
        return <Moon size={size} className={`${className} text-indigo-300`} />;
      case 'CloudSun':
        return <CloudSun size={size} className={`${className} text-amber-300`} />;
      case 'CloudMoon':
        return <CloudMoon size={size} className={`${className} text-indigo-200`} />;
      case 'Cloud':
        return <Cloud size={size} className={`${className} text-slate-300`} />;
      case 'CloudFog':
        return <CloudFog size={size} className={`${className} text-slate-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle size={size} className={`${className} text-cyan-300`} />;
      case 'CloudRain':
        return <CloudRain size={size} className={`${className} text-blue-400`} />;
      case 'CloudRainWind':
        return <CloudRainWind size={size} className={`${className} text-blue-500`} />;
      case 'CloudHail':
        return <CloudHail size={size} className={`${className} text-teal-300`} />;
      case 'Snowflake':
      case 'CloudSnow':
        return <Snowflake size={size} className={`${className} text-sky-200`} />;
      case 'CloudLightning':
        return <CloudLightning size={size} className={`${className} text-yellow-400`} />;
      default:
        return isDay ? (
          <Sun size={size} className={`${className} text-amber-400`} />
        ) : (
          <Moon size={size} className={`${className} text-indigo-300`} />
        );
    }
  };

  return <>{getIcon()}</>;
};
