import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  RotateCw,
  Sliders,
  Check,
  Navigation,
  Globe
} from 'lucide-react';
import { GeoLocation, UnitSystem } from '../types/weather';
import { searchCities, DEFAULT_LOCATIONS } from '../services/openMeteo';

interface HeaderProps {
  currentLocation: GeoLocation;
  unitSystem: UnitSystem;
  onSelectLocation: (loc: GeoLocation) => void;
  onToggleUnit: (unit: UnitSystem) => void;
  onRefresh: () => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  unitSystem,
  onSelectLocation,
  onToggleUnit,
  onRefresh,
  onUseCurrentLocation,
  isLoading,
  isLocating
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchCities(query);
      setSuggestions(results);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  return (
    <header id="app-header" className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col gap-3">
        {/* Top bar: Brand & Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-900/30 text-white font-bold">
              <Compass className="w-5 h-5 text-white animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Weather Intelligence
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                  Open-Meteo
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                High-precision meteorological telemetry & planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unit Toggle Button */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium">
              <button
                id="unit-toggle-metric"
                type="button"
                onClick={() => onToggleUnit('metric')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Celsius, km/h, mm"
              >
                °C
              </button>
              <button
                id="unit-toggle-imperial"
                type="button"
                onClick={() => onToggleUnit('imperial')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  unitSystem === 'imperial'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Fahrenheit, mph, inch"
              >
                °F
              </button>
            </div>

            {/* GPS Location Button */}
            <button
              id="gps-location-btn"
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors disabled:opacity-50"
              title="Detect current location via GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>

            {/* Refresh Button */}
            <button
              id="refresh-weather-btn"
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-50"
              title="Refresh weather telemetry"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar & City Selector Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Autocomplete Input */}
          <div ref={searchContainerRef} className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setIsDropdownOpen(true);
                }}
                placeholder="Search any global city, state, or region (e.g., Tokyo, Zurich, Vancouver)..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
              />
              {isSearching && (
                <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin absolute right-3 pointer-events-none" />
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div
                id="search-suggestions-dropdown"
                className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/50 flex items-center justify-between">
                  <span>Matching Locations</span>
                  <span className="text-slate-500">{suggestions.length} results</span>
                </div>
                {suggestions.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-cyan-200">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick City Quick-Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap pl-1 pr-0.5 hidden lg:inline">
              Popular:
            </span>
            {DEFAULT_LOCATIONS.slice(0, 5).map((loc) => {
              const isSelected = loc.name.toLowerCase() === currentLocation.name.toLowerCase();
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onSelectLocation(loc)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                      : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800/80'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
