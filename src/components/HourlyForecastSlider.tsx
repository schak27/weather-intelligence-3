import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { HourlyPoint, UnitSystem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastSliderProps {
  hourly: HourlyPoint[];
  unitSystem: UnitSystem;
}

export const HourlyForecastSlider: React.FC<HourlyForecastSliderProps> = ({
  hourly,
  unitSystem
}) => {
  const tempUnit = unitSystem === 'metric' ? '°' : '°';
  const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';

  // Display the next 24 hours
  const next24 = hourly.slice(0, 24);

  return (
    <div id="hourly-forecast-bar" className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Hourly Trajectory (Next 24 Hours)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Scroll horizontally for full timeline
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        {next24.map((point, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={point.time}
              className={`flex flex-col items-center justify-between p-2.5 rounded-xl min-w-[78px] border text-center transition-colors shrink-0 ${
                isNow
                  ? 'bg-cyan-950/40 border-cyan-500/40 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-850 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-semibold ${isNow ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                {isNow ? 'Now' : point.formattedTime}
              </span>

              <div className="my-2">
                <WeatherIcon
                  code={point.weatherCode}
                  isDay={new Date(point.time).getHours() >= 6 && new Date(point.time).getHours() < 19}
                  className="w-6 h-6 mx-auto"
                />
              </div>

              <span className="text-sm font-bold text-white">
                {Math.round(point.temperature)}{tempUnit}
              </span>

              <div className="flex items-center gap-0.5 text-[11px] mt-1 text-cyan-300 font-medium">
                <Droplets className="w-2.5 h-2.5" />
                <span>{point.precipitationProbability}%</span>
              </div>

              <div className="text-[10px] text-slate-500 mt-0.5">
                {Math.round(point.windSpeed)} {speedUnit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
