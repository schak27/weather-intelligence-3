import React, { useState } from 'react';
import {
  Sparkles,
  Footprints,
  Shirt,
  Car,
  Home,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ActivityRecommendation, WeatherAlert } from '../types/weather';

interface PlanningRecommendationsProps {
  recommendations: ActivityRecommendation[];
  alerts: WeatherAlert[];
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
  alerts
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'outdoor-activity': true,
    'wardrobe-advisor': true,
    'commute-travel': true,
    'home-ventilation': true
  });

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: ActivityRecommendation['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Optimal
          </span>
        );
      case 'moderate':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Info className="w-3 h-3" /> Favorable
          </span>
        );
      case 'caution':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" /> Caution
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Advisory
          </span>
        );
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'outdoor-activity':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'wardrobe-advisor':
        return <Shirt className="w-4 h-4 text-amber-400" />;
      case 'commute-travel':
        return <Car className="w-4 h-4 text-blue-400" />;
      case 'home-ventilation':
        return <Home className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter((r) => r.category === selectedCategory);

  return (
    <div id="planning-recommendations-section" className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Planning & Lifestyle Recommendations
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic meteorological analysis for your day
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
          >
            All Plans
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('activity')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedCategory === 'activity'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
          >
            Athletics
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('wardrobe')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedCategory === 'wardrobe'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
          >
            Wardrobe
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('commute')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedCategory === 'commute'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
          >
            Commute
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('home')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedCategory === 'home'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
          >
            Home
          </button>
        </div>
      </div>

      {/* Critical Meteorological Alerts Banner (if active) */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                alert.severity === 'severe'
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider">
                  {alert.title}
                </div>
                <p className="text-xs opacity-90">{alert.description}</p>
                <p className="text-xs font-semibold underline decoration-rose-400/50">
                  {alert.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sleek Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredRecommendations.map((item) => {
          const isExpanded = expandedCards[item.id] ?? true;

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Card Title Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-750">
                      {getCategoryIcon(item.id)}
                    </div>
                    <span className="text-sm font-bold text-slate-100">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Score Indicator if Present (e.g. Athletics) */}
                {typeof item.score === 'number' && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Activity Comfort Index</span>
                      <span className="font-bold text-white">{item.score} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.score >= 70
                            ? 'bg-emerald-400'
                            : item.score >= 40
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Summary Text */}
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Actionable Details Bullets */}
              {isExpanded && item.details.length > 0 && (
                <ul className="space-y-1 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
