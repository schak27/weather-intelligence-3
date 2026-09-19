import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Compass,
  Gauge,
  Cloud,
  Eye,
  Sunset,
  Sunrise,
  ArrowUp,
  ArrowDown,
  Navigation2
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherCodeInfo,
  getWindDirectionName,
  getUvIndexTier,
  getHumidityComfort,
  getPressureStatus
} from '../utils/weatherCodes';

interface CurrentConditionsProps {
  weatherData: WeatherData;
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = ({ weatherData }) => {
  const { location, current, daily, unitSystem, lastUpdated } = weatherData;
  const today = daily[0];
  const weatherInfo = getWeatherCodeInfo(current.weatherCode, current.isDay);
  const uvTier = getUvIndexTier(current.uvIndex);
  const humidityStatus = getHumidityComfort(current.relativeHumidity);
  const pressureStatus = getPressureStatus(current.pressureMsl);

  const tempUnit = unitSystem === 'metric' ? '°C' : '°F';
  const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';
  const precipUnit = unitSystem === 'metric' ? 'mm' : 'in';

  // Format sunrise / sunset
  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  // Calculate daylight percentage progress if current time is available
  const getDaylightProgress = () => {
    if (!today?.sunrise || !today?.sunset) return 50;
    const now = new Date().getTime();
    const rise = new Date(today.sunrise).getTime();
    const set = new Date(today.sunset).getTime();
    if (now < rise) return 0;
    if (now > set) return 100;
    return Math.round(((now - rise) / (set - rise)) * 100);
  };

  const daylightProgress = getDaylightProgress();

  return (
    <section id="current-conditions-section" className="w-full space-y-4">
      {/* Top Banner: Location & Main Conditions Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-7 shadow-xl">
        {/* Ambient atmospheric backdrop glow */}
        <div
          className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
            current.weatherCode >= 95
              ? 'bg-amber-400'
              : current.weatherCode >= 51
              ? 'bg-blue-600'
              : current.isDay
              ? 'bg-amber-500'
              : 'bg-indigo-600'
          }`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Location & Live Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Telemetry
              </span>
              <span className="text-xs text-slate-400">
                Updated {lastUpdated}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {location.name}
                {location.country_code && (
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {location.country_code}
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {[location.admin1, location.country].filter(Boolean).join(', ')} ·{' '}
                <span className="font-mono text-xs text-slate-500">{location.timezone}</span>
              </p>
            </div>

            {/* Condition description & Day/Night badge */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                <WeatherIcon code={current.weatherCode} isDay={current.isDay} className="w-5 h-5" />
                <span className="text-sm font-semibold">{weatherInfo.description}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-850 text-slate-400 border border-slate-800">
                {current.isDay ? 'Daytime' : 'Nighttime'}
              </span>
            </div>
          </div>

          {/* Right Column: Hero Temperature and Hi/Lo */}
          <div className="flex items-center sm:items-end justify-between lg:justify-end gap-6 sm:gap-10 border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
            <div className="flex items-start">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white">
                {Math.round(current.temperature)}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-cyan-400 ml-1 mt-1">
                {tempUnit}
              </span>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="text-xs text-slate-400">
                Feels like{' '}
                <span className="text-sm font-bold text-slate-200">
                  {Math.round(current.apparentTemperature)}{tempUnit}
                </span>
              </div>

              {today && (
                <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                  <span className="flex items-center text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/30">
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                    {today.temperatureMax}{tempUnit}
                  </span>
                  <span className="flex items-center text-sky-400 bg-sky-950/30 px-2 py-0.5 rounded border border-sky-900/30">
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                    {today.temperatureMin}{tempUnit}
                  </span>
                </div>
              )}

              {today && (
                <div className="text-[11px] text-slate-500">
                  Precip: {today.precipitationSum} {precipUnit} ({today.precipitationProbabilityMax}%)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meteorological Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Humidity & Dew Point */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight">
              {current.relativeHumidity}%
            </div>
            <div className="text-xs text-cyan-300/90 font-medium">
              {humidityStatus.label}
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-1.5 rounded-full transition-all"
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
        </div>

        {/* 2. Wind Speed & Direction */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Wind Telemetry</span>
            <Wind className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
              {current.windSpeed}
              <span className="text-xs font-normal text-slate-400">{speedUnit}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Navigation2
                className="w-3 h-3 text-cyan-400 transform"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
              <span className="font-semibold">{getWindDirectionName(current.windDirection)}</span>
              <span className="text-slate-500">({current.windDirection}°)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Gusts: {current.windGusts} {speedUnit}
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1.5">
              {current.uvIndex}
              <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${uvTier.color}`}>
                {uvTier.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {today ? `Peak: ${today.uvIndexMax}` : 'Daily range'}
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
            />
          </div>
        </div>

        {/* 4. Barometric Pressure */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pressure (MSL)</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
              {current.pressureMsl}
              <span className="text-xs font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {pressureStatus.trend}
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Surface: {current.surfacePressure} hPa
          </div>
        </div>

        {/* 5. Cloud Cover & Rain */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-300" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight">
              {current.cloudCover}%
            </div>
            <div className="text-xs text-slate-300">
              {current.cloudCover > 80 ? 'Heavy overcast' : current.cloudCover > 40 ? 'Partly cloudy' : 'Clear skies'}
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-400 h-1.5 rounded-full"
              style={{ width: `${current.cloudCover}%` }}
            />
          </div>
        </div>

        {/* 6. Sunrise & Sunset Cycle */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Sun Cycle</span>
            <Sunset className="w-4 h-4 text-orange-400" />
          </div>
          <div className="my-1.5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <Sunrise className="w-3 h-3 text-amber-400" /> Rise
              </span>
              <span className="font-semibold text-slate-200">{formatSunTime(today?.sunrise)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <Sunset className="w-3 h-3 text-orange-400" /> Set
              </span>
              <span className="font-semibold text-slate-200">{formatSunTime(today?.sunset)}</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full"
              style={{ width: `${daylightProgress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
