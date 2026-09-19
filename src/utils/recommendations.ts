import { CurrentWeather, DailyForecast, HourlyPoint, ActivityRecommendation, WeatherAlert, UnitSystem } from '../types/weather';

export function generatePlanningRecommendations(
  current: CurrentWeather,
  daily: DailyForecast[],
  hourly: HourlyPoint[],
  unitSystem: UnitSystem
): { recommendations: ActivityRecommendation[]; alerts: WeatherAlert[] } {
  const recommendations: ActivityRecommendation[] = [];
  const alerts: WeatherAlert[] = [];

  const tempC = unitSystem === 'metric' ? current.temperature : ((current.temperature - 32) * 5) / 9;
  const apparentC = unitSystem === 'metric' ? current.apparentTemperature : ((current.apparentTemperature - 32) * 5) / 9;
  const windKmh = unitSystem === 'metric' ? current.windSpeed : current.windSpeed * 1.60934;
  const isRaining = current.precipitation > 0 || current.rain > 0 || current.showers > 0;
  const today = daily[0];

  // 1. Critical Weather Alerts
  if (current.weatherCode >= 95) {
    alerts.push({
      id: 'thunderstorm-warning',
      severity: 'severe',
      title: 'Thunderstorm Active or Imminent',
      description: 'Lightning risk and localized heavy gusts reported in current forecast zone.',
      recommendation: 'Seek sturdy shelter. Delay outdoor recreational sports and open-water activities.'
    });
  } else if (current.weatherCode >= 71 && current.weatherCode <= 86) {
    alerts.push({
      id: 'snow-advisory',
      severity: 'moderate',
      title: 'Snowfall & Freezing Conditions',
      description: 'Slippery surfaces and potential icy patches likely on walkways and bridges.',
      recommendation: 'Wear insulated footwear with tread. Increase commute stopping distance.'
    });
  } else if (windKmh > 50) {
    alerts.push({
      id: 'high-wind',
      severity: 'moderate',
      title: 'Strong Gusts Advisory',
      description: `Wind gusts exceeding ${Math.round(current.windGusts)} ${unitSystem === 'metric' ? 'km/h' : 'mph'}.`,
      recommendation: 'Secure loose outdoor furniture and exercise caution when cycling or driving high-profile vehicles.'
    });
  } else if (current.uvIndex >= 8) {
    alerts.push({
      id: 'extreme-uv',
      severity: 'moderate',
      title: 'High UV Radiation',
      description: `Peak UV Index currently at ${current.uvIndex.toFixed(1)}. Skin can burn in under 15 minutes.`,
      recommendation: 'Wear SPF 30+ broad spectrum sunscreen, UV400 sunglasses, and seek shade during midday hours.'
    });
  }

  // 2. Outdoor & Exercise Recommendation
  let outdoorScore = 90;
  const outdoorDetails: string[] = [];

  // Temperature penalty
  if (tempC < 5) {
    outdoorScore -= 25;
    outdoorDetails.push(`Brisk cold (${Math.round(current.temperature)}°): warm dynamic warmup and thermal gear needed.`);
  } else if (tempC >= 13 && tempC <= 23) {
    outdoorScore += 10;
    outdoorDetails.push(`Optimal thermal comfort range (${Math.round(current.temperature)}°) for jogging and outdoor sports.`);
  } else if (tempC > 28 && tempC <= 33) {
    outdoorScore -= 20;
    outdoorDetails.push(`Elevated ambient temperature: schedule workouts for early morning or post-sunset.`);
  } else if (tempC > 33) {
    outdoorScore -= 40;
    outdoorDetails.push(`Extreme heat stress risk: avoid strenuous outdoor workouts under direct sun.`);
  }

  // Rain penalty
  if (isRaining) {
    outdoorScore -= 45;
    outdoorDetails.push(`Active precipitation (${current.precipitation.toFixed(1)} ${unitSystem === 'metric' ? 'mm' : 'in'}): wet ground and reduced traction.`);
  } else if (today && today.precipitationProbabilityMax > 50) {
    outdoorScore -= 15;
    outdoorDetails.push(`Elevated rain chance (${today.precipitationProbabilityMax}%) today: consider having a backup indoor venue.`);
  } else {
    outdoorDetails.push('Low precipitation probability over the next few hours.');
  }

  // Wind penalty
  if (windKmh > 35) {
    outdoorScore -= 25;
    outdoorDetails.push(`Noticeable headwinds (${Math.round(current.windSpeed)} ${unitSystem === 'metric' ? 'km/h' : 'mph'}): challenging for cycling and tennis.`);
  }

  // Clamp score
  outdoorScore = Math.max(10, Math.min(100, outdoorScore));

  let outdoorStatus: 'optimal' | 'moderate' | 'caution' | 'warning' = 'optimal';
  let outdoorSummary = 'Prime weather for outdoor workouts, walking, and park activities.';
  if (outdoorScore < 40) {
    outdoorStatus = 'warning';
    outdoorSummary = 'Adverse conditions. Indoor training or gym workouts strongly recommended.';
  } else if (outdoorScore < 70) {
    outdoorStatus = 'caution';
    outdoorSummary = 'Acceptable for outdoors with proper preparation and gear.';
  }

  recommendations.push({
    id: 'outdoor-activity',
    title: 'Outdoor & Athletics Rating',
    category: 'activity',
    score: outdoorScore,
    status: outdoorStatus,
    summary: outdoorSummary,
    details: outdoorDetails,
    icon: 'Footprints'
  });

  // 3. Wardrobe & Layering Guide
  const wardrobeDetails: string[] = [];
  let wardrobeSummary = '';
  let wardrobeStatus: 'optimal' | 'moderate' | 'caution' | 'warning' = 'optimal';

  if (apparentC < 0) {
    wardrobeStatus = 'caution';
    wardrobeSummary = 'Heavy winter protection: insulated thermal parka, wool beanie, gloves, and thermal base layers.';
    wardrobeDetails.push('Wear moisture-wicking synthetic or merino wool inner layer.');
    wardrobeDetails.push('Windproof outer shell to counteract severe windchill.');
  } else if (apparentC < 10) {
    wardrobeStatus = 'moderate';
    wardrobeSummary = 'Warm layered outfit: sweater, medium-weight coat, and enclosed shoes.';
    wardrobeDetails.push('A light scarf or neck warmer is advisable in drafty areas.');
  } else if (apparentC < 18) {
    wardrobeStatus = 'optimal';
    wardrobeSummary = 'Light layers: comfortable long sleeves, cardigan or light jacket you can remove.';
    wardrobeDetails.push('Versatile layering adapts easily as the temperature shifts.');
  } else if (apparentC < 26) {
    wardrobeStatus = 'optimal';
    wardrobeSummary = 'Comfortable light attire: breathable cotton or linen t-shirt and casual pants/shorts.';
    wardrobeDetails.push('Comfortable ambient temperature requiring minimal extra layers.');
  } else {
    wardrobeStatus = 'caution';
    wardrobeSummary = 'Hot weather gear: loose, ultra-breathable, light-colored clothing.';
    wardrobeDetails.push('Sunglasses with UV400 protection and a wide-brim hat.');
  }

  if (isRaining || (today && today.precipitationProbabilityMax >= 40)) {
    wardrobeDetails.push('Pack a compact umbrella or water-resistant hooded jacket.');
  }

  recommendations.push({
    id: 'wardrobe-advisor',
    title: 'Wardrobe & Layering Guide',
    category: 'wardrobe',
    status: wardrobeStatus,
    summary: wardrobeSummary,
    details: wardrobeDetails,
    icon: 'Shirt'
  });

  // 4. Commute & Travel Advisory
  const commuteDetails: string[] = [];
  let commuteStatus: 'optimal' | 'moderate' | 'caution' | 'warning' = 'optimal';
  let commuteSummary = 'Roads and transit routes expected to operate normally under fair skies.';

  if (current.weatherCode >= 45 && current.weatherCode <= 48) {
    commuteStatus = 'caution';
    commuteSummary = 'Foggy conditions: restricted roadway visibility.';
    commuteDetails.push('Use low-beam headlights or fog lamps; avoid high beams.');
    commuteDetails.push('Allow extra headway between vehicles on highways.');
  } else if (isRaining) {
    commuteStatus = 'caution';
    commuteSummary = 'Wet roads & tire spray: moderate impact on traffic speed.';
    commuteDetails.push('Hydroplaning risk on waterlogged highway ruts.');
    commuteDetails.push('Pedestrians should watch for puddle splashing at curbs.');
  } else if (windKmh > 40) {
    commuteStatus = 'moderate';
    commuteSummary = 'Moderate gusts affecting bridges and exposed open roadways.';
    commuteDetails.push('Hold steering wheel firmly when passing large semi-trucks.');
  } else {
    commuteDetails.push('Dry pavement with clear visibility along primary corridors.');
    commuteDetails.push('Favorable conditions for walking, cycling, or driving.');
  }

  recommendations.push({
    id: 'commute-travel',
    title: 'Commute & Travel Conditions',
    category: 'commute',
    status: commuteStatus,
    summary: commuteSummary,
    details: commuteDetails,
    icon: 'Car'
  });

  // 5. Home, Air & Ventilation
  const homeDetails: string[] = [];
  let homeStatus: 'optimal' | 'moderate' | 'caution' | 'warning' = 'optimal';
  let homeSummary = '';

  if (isRaining) {
    homeStatus = 'caution';
    homeSummary = 'Keep exterior windows closed to prevent rain intrusion.';
    homeDetails.push('Use dehumidifier or indoor AC circulation if humidity rises.');
  } else if (tempC >= 17 && tempC <= 24 && current.relativeHumidity <= 65) {
    homeStatus = 'optimal';
    homeSummary = 'Ideal time for fresh air cross-ventilation in homes and workspaces.';
    homeDetails.push('Open windows for 20-30 minutes to replenish indoor oxygen levels.');
    homeDetails.push('Natural temperature regulation reduces HVAC electricity load.');
  } else if (tempC > 28) {
    homeStatus = 'moderate';
    homeSummary = 'Seal windows and close south/west blinds to block radiant solar heat.';
    homeDetails.push('Pre-cool living spaces before late-afternoon peak grid hours.');
  } else {
    homeStatus = 'moderate';
    homeSummary = 'Maintain sealed doors/windows to preserve thermal insulation.';
    homeDetails.push('Check window seals for drafts if ambient wind speed increases.');
  }

  recommendations.push({
    id: 'home-ventilation',
    title: 'Home & Energy Ventilation',
    category: 'home',
    status: homeStatus,
    summary: homeSummary,
    details: homeDetails,
    icon: 'Home'
  });

  return { recommendations, alerts };
}
