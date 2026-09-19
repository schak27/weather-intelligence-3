import React from 'react';
import { Calendar, Droplets, Wind, Sun, ChevronRight } from 'lucide-react';
import { DailyForecast, UnitSystem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface Forecast7DayProps {
  daily: DailyForecast[];
  unitSystem: UnitSystem;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({
  daily,
  unitSystem,
  selectedDayIndex,
  onSelectDay
}) => {
  const tempUnit = unitSystem === 'metric' ? '°' : '°';
  const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';

  // Calculate the overall minimum and maximum across the entire 7 days for the relative bar
  const weekMin = Math.min(...daily.map((d) => d.temperatureMin));
  const weekMax = Math.max(...daily.map((d) => d.temperatureMax));
  const weekRange = Math.max(1, weekMax - weekMin);

  return (
    <div id="extended-forecast-card" className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            7-Day Extended Outlook
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Click any day to examine conditions
        </span>
      </div>

      <div className="space-y-2">
        {daily.map((day, idx) => {
          const info = getWeatherCodeInfo(day.weatherCode, true);
          const isSelected = selectedDayIndex === idx;

          // Calculate visual temperature bar width and position
          const leftPercent = Math.max(0, ((day.temperatureMin - weekMin) / weekRange) * 100);
          const barWidthPercent = Math.max(8, ((day.temperatureMax - day.temperatureMin) / weekRange) * 100);

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/50 hover:bg-slate-850/70 border-slate-800/70'
              }`}
            >
              {/* Day & Date & Icon */}
              <div className="flex items-center gap-3 md:w-56 shrink-0">
                <WeatherIcon code={day.weatherCode} isDay={true} className="w-7 h-7 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">
                      {day.dayName}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {day.formattedDate} · <span className="text-slate-300">{info.description}</span>
                  </div>
                </div>
              </div>

              {/* Rain Probability & Wind Details */}
              <div className="flex items-center gap-4 text-xs md:w-44 shrink-0">
                <div className="flex items-center gap-1 text-slate-300 w-16">
                  <Droplets className={`w-3.5 h-3.5 ${day.precipitationProbabilityMax > 30 ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className={day.precipitationProbabilityMax > 30 ? 'font-semibold text-cyan-300' : 'text-slate-400'}>
                    {day.precipitationProbabilityMax}%
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>{day.windSpeedMax} {speedUnit}</span>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-slate-400">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>UV {day.uvIndexMax}</span>
                </div>
              </div>

              {/* Min - Max Temperature Spread Gauge */}
              <div className="flex items-center gap-3 flex-1 max-w-sm">
                <span className="w-9 text-right text-xs font-semibold text-sky-300">
                  {day.temperatureMin}{tempUnit}
                </span>

                {/* Relative Bar */}
                <div className="relative flex-1 bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`
                    }}
                  />
                </div>

                <span className="w-9 text-left text-xs font-bold text-rose-300">
                  {day.temperatureMax}{tempUnit}
                </span>

                <ChevronRight className={`w-4 h-4 transition-transform hidden sm:block ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
