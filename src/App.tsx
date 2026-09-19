import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CurrentConditions } from './components/CurrentConditions';
import { HourlyForecastSlider } from './components/HourlyForecastSlider';
import { Forecast7Day } from './components/Forecast7Day';
import { WeatherCharts } from './components/WeatherCharts';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { GeoLocation, WeatherData, UnitSystem } from './types/weather';
import { DEFAULT_LOCATIONS, fetchWeatherData, reverseGeocodeCoords } from './services/openMeteo';
import { generatePlanningRecommendations } from './utils/recommendations';
import { AlertCircle, RotateCcw, CloudSun, Sparkles } from 'lucide-react';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('weather_intel_last_loc');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LOCATIONS[0]; // New York
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('weather_intel_unit');
      if (saved === 'imperial' || saved === 'metric') return saved;
    } catch {
      // fallback
    }
    return 'metric';
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Load weather data for current location & unit
  const loadWeather = useCallback(async (loc: GeoLocation, unit: UnitSystem) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchWeatherData(loc, unit);
      setWeatherData(data);
      localStorage.setItem('weather_intel_last_loc', JSON.stringify(loc));
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setErrorMessage(
        err?.message || 'Failed to communicate with Open-Meteo forecast service. Please check your network and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(currentLocation, unitSystem);
  }, [currentLocation, unitSystem, loadWeather]);

  // Handle location selection
  const handleSelectLocation = (loc: GeoLocation) => {
    setCurrentLocation(loc);
    setSelectedDayIndex(0);
  };

  // Handle unit toggle
  const handleToggleUnit = (unit: UnitSystem) => {
    setUnitSystem(unit);
    localStorage.setItem('weather_intel_unit', unit);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadWeather(currentLocation, unitSystem);
  };

  // Handle GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await reverseGeocodeCoords(lat, lon);
          setCurrentLocation(loc);
          setSelectedDayIndex(0);
        } catch {
          setErrorMessage('Could not determine city name from GPS coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please search your city using the search bar.');
        } else {
          setErrorMessage('Unable to retrieve your current location. Please try searching instead.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Compute planning recommendations
  const planningData = weatherData
    ? generatePlanningRecommendations(
        weatherData.current,
        weatherData.daily,
        weatherData.hourly,
        unitSystem
      )
    : { recommendations: [], alerts: [] };

  return (
    <div id="weather-intelligence-app" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navigation & Search Header */}
      <Header
        currentLocation={currentLocation}
        unitSystem={unitSystem}
        onSelectLocation={handleSelectLocation}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoading={isLoading}
        isLocating={isLocating}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Notification */}
        {errorMessage && (
          <div
            id="weather-error-banner"
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-center justify-between gap-4 shadow-lg animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-xs sm:text-sm">{errorMessage}</div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-rose-900/60 hover:bg-rose-900 text-white border border-rose-700 shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-4 animate-pulse">
            <div className="h-44 rounded-2xl bg-slate-900/80 border border-slate-800" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-slate-900/70 border border-slate-800" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-slate-900/70 border border-slate-800" />
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <div className="space-y-6">
            {/* 1. Hero & Detailed Current Telemetry */}
            <CurrentConditions weatherData={weatherData} />

            {/* 2. Hourly Trajectory Strip */}
            <HourlyForecastSlider hourly={weatherData.hourly} unitSystem={unitSystem} />

            {/* 3. Visual Weather Charts (Temperature, Precip, Wind, UV) */}
            <WeatherCharts
              hourly={weatherData.hourly}
              daily={weatherData.daily}
              unitSystem={unitSystem}
              selectedDayIndex={selectedDayIndex}
            />

            {/* 4. Two Column Layout: 7-Day Extended Outlook & Planning Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 7-Day Extended Outlook (7 cols) */}
              <div className="lg:col-span-6 xl:col-span-7">
                <Forecast7Day
                  daily={weatherData.daily}
                  unitSystem={unitSystem}
                  selectedDayIndex={selectedDayIndex}
                  onSelectDay={(idx) => setSelectedDayIndex(idx)}
                />
              </div>

              {/* Right Column: Sleek Planning Recommendations Dashboard (5 cols) */}
              <div className="lg:col-span-6 xl:col-span-5">
                <PlanningRecommendations
                  recommendations={planningData.recommendations}
                  alerts={planningData.alerts}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sleek Minimalist Footer */}
      <footer id="app-footer" className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CloudSun className="w-4 h-4 text-cyan-400" />
            <span>Weather Intelligence powered by Open-Meteo Free Weather API</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Non-commercial Open-Access Data</span>
            <span>·</span>
            <span>WMO Synoptic Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
