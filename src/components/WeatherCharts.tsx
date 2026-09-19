import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Line,
  Legend
} from 'recharts';
import { Thermometer, Droplets, Wind, Sun, BarChart3 } from 'lucide-react';
import { HourlyPoint, DailyForecast, UnitSystem } from '../types/weather';

interface WeatherChartsProps {
  hourly: HourlyPoint[];
  daily: DailyForecast[];
  unitSystem: UnitSystem;
  selectedDayIndex: number;
}

type ChartMetric = 'temperature' | 'precipitation' | 'wind' | 'uv';
type ChartRange = '24h' | '48h' | '7d';

interface ChartDataPoint {
  label: string;
  temp?: number;
  tempMax?: number;
  tempMin?: number;
  apparentMax?: number;
  apparentMin?: number;
  humidity?: number;
  precipProb: number;
  precipAmount: number;
  wind: number;
  gusts?: number;
  uv: number;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  hourly,
  daily,
  unitSystem,
  selectedDayIndex
}) => {
  const [metric, setMetric] = useState<ChartMetric>('temperature');
  const [range, setRange] = useState<ChartRange>('24h');

  const tempUnit = unitSystem === 'metric' ? '°C' : '°F';
  const speedUnit = unitSystem === 'metric' ? 'km/h' : 'mph';
  const precipUnit = unitSystem === 'metric' ? 'mm' : 'in';

  // Prepare data depending on range
  const getChartData = (): ChartDataPoint[] => {
    if (range === '7d') {
      return daily.map((d) => ({
        label: d.dayName,
        tempMax: d.temperatureMax,
        tempMin: d.temperatureMin,
        apparentMax: d.apparentTemperatureMax,
        apparentMin: d.apparentTemperatureMin,
        precipProb: d.precipitationProbabilityMax,
        precipAmount: d.precipitationSum,
        wind: d.windSpeedMax,
        uv: d.uvIndexMax
      }));
    }

    const count = range === '24h' ? 24 : 48;
    return hourly.slice(0, count).map((h) => ({
      label: h.formattedTime,
      temp: h.temperature,
      humidity: h.relativeHumidity,
      precipProb: h.precipitationProbability,
      precipAmount: h.precipitation,
      wind: h.windSpeed,
      gusts: h.windGusts,
      uv: h.uvIndex
    }));
  };

  const chartData: ChartDataPoint[] = getChartData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[140px]">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">{range === '7d' ? 'Daily' : 'Hour'}</span>
        </div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value}
              {entry.name.includes('Temp') || entry.name.includes('Min') || entry.name.includes('Max')
                ? tempUnit
                : entry.name.includes('Precipitation') || entry.name.includes('Rain')
                ? ` ${precipUnit}`
                : entry.name.includes('Prob')
                ? '%'
                : entry.name.includes('Wind') || entry.name.includes('Gust')
                ? ` ${speedUnit}`
                : ''}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="weather-charts-card" className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      {/* Header with Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Visual Weather Telemetry Charts
            </h2>
            <p className="text-xs text-slate-400">
              High-resolution trends and atmospheric projections
            </p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setRange('24h')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                range === '24h'
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Next 24H
            </button>
            <button
              type="button"
              onClick={() => setRange('48h')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                range === '48h'
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              48 Hours
            </button>
            <button
              type="button"
              onClick={() => setRange('7d')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                range === '7d'
                  ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7-Day Range
            </button>
          </div>
        </div>
      </div>

      {/* Metric Mode Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setMetric('temperature')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            metric === 'temperature'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 font-semibold'
              : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          Temperature Curve
        </button>

        <button
          type="button"
          onClick={() => setMetric('precipitation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            metric === 'precipitation'
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 font-semibold'
              : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          Precipitation & Rain Probability
        </button>

        <button
          type="button"
          onClick={() => setMetric('wind')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            metric === 'wind'
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/40 font-semibold'
              : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-blue-400" />
          Wind Velocity & Gusts
        </button>

        <button
          type="button"
          onClick={() => setMetric('uv')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            metric === 'uv'
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/40 font-semibold'
              : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-purple-400" />
          UV Radiation Cycle
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tempMinGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} unit={tempUnit} />
              <Tooltip content={<CustomTooltip />} />
              {range === '7d' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="tempMax"
                    name="Max Temp"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tempMin"
                    name="Min Temp"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tempMinGradient)"
                  />
                </>
              ) : (
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
              )}
            </AreaChart>
          ) : metric === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit={` ${precipUnit}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="precipAmount"
                name="Rain Amount"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="precipProb"
                name="Rain Prob"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
            </BarChart>
          ) : metric === 'wind' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} unit={` ${speedUnit}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wind"
                name="Sustained Wind"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
              {range !== '7d' && (
                <Line
                  type="monotone"
                  dataKey="gusts"
                  name="Wind Gusts"
                  stroke="#60a5fa"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              )}
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="uv"
                name="UV Index"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#uvGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
