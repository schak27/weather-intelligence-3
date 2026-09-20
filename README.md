# Weather Intelligence ⛅

A modern, high-precision meteorological dashboard that combines real-time atmospheric telemetry from Open-Meteo, interactive visual weather trend charts, 7-day extended outlooks, and deterministic daily planning recommendations.

---

## 🌟 Features & Overview

- **Global City Search & Geocoding**: Search any worldwide city, state, or region with instant debounced autocompletion powered by Open-Meteo Geocoding API.
- **GPS Location Detection**: One-click device geolocation with reverse geocoding to automatically load your local weather.
- **Detailed Current Conditions**:
  - Live temperature and apparent ("feels-like") temperature.
  - Wind speed, wind gusts, and continuous wind direction with rotating directional vector.
  - Relative humidity with comfort rating (Dry, Comfortable, Humid, Muggy).
  - Barometric pressure (MSL and surface level) with trend indicators.
  - Real-time UV Index with danger classification tiers and protective guidance.
  - Cloud cover percentage and daylight cycle tracking sunrise/sunset progress.
- **24-Hour Hourly Trajectory**:
  - Horizontal scrollable timeline displaying temperature, condition icons, rain probabilities, and wind speeds for the next 24 hours.
- **Interactive Visual Weather Charts**:
  - Visualized with **Recharts** across **24-Hour**, **48-Hour**, and **7-Day** timeframes.
  - **Temperature Curve**: Max/min temperature gradients and trend curves.
  - **Precipitation**: Dual-axis bar and line chart for rainfall amounts and precipitation probability percentages.
  - **Wind & Gusts**: Velocity curves paired with gust thresholds.
  - **UV Radiation Cycle**: Solar UV index exposure progression throughout the day.
- **7-Day Extended Outlook**:
  - Comprehensive 7-day forecast with dynamic weekly temperature spread bars, rain probabilities, and condition summaries.
  - Interactive selection to highlight conditions for any specific day.
- **Smart Planning & Lifestyle Recommendations**:
  - **Athletics & Outdoor Activity**: 0–100 comfort score evaluating thermal comfort, precipitation risk, and wind resistance.
  - **Wardrobe & Layering Guide**: Layering recommendations based on apparent temperature, wind chill, and rain probability.
  - **Commute & Travel Advisory**: Road safety alerts for wet pavement, reduced visibility, and crosswinds.
  - **Home & Energy Ventilation**: Guidance on natural fresh-air cross-ventilation versus sealed HVAC temperature regulation.
- **Unit Customization**:
  - One-click toggle between **Metric** (°C, km/h, mm) and **Imperial** (°F, mph, in) with persistent browser storage.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom responsive dashboard theme
- **Charting**: Recharts (AreaChart, BarChart, LineChart)
- **Icons**: Lucide React
- **API Provider**: Open-Meteo (free open-access meteorological API — no API key required)
  - Weather Forecast API (`https://api.open-meteo.com/v1/forecast`)
  - Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`)

---

## 🚀 Work Done

1. **Meteorological API Integration**: Built a robust service layer connecting to Open-Meteo's weather and geocoding endpoints, parsing WMO synoptic weather codes, hourly projections, and 7-day daily summaries.
2. **Dashboard UI**: Designed a responsive interface with high-contrast slate cards, atmospheric backdrop glows, and intuitive micro-interactions.
3. **Data Visualizations**: Configured responsive chart components for temperature, rain, wind, and UV curves with custom tooltips.
4. **Algorithmic Planning Engine**: Developed a deterministic advisory model converting multi-variable meteorological factors (wind chill, humidity, precipitation, UV) into actionable daily advice.
5. **Cloudflare Deployment Readiness**: Configured the project for zero-configuration deployment to Cloudflare Pages (including `_redirects` and `wrangler.toml`).

---

## 🌐 Deploying to Cloudflare

This repository is optimized for deployment to **Cloudflare Pages** as a high-performance static SPA.

### Option 1: Deploy via Cloudflare Pages & GitHub (Recommended)

1. Push this repository to your **GitHub** account.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4. Select your `weather-intelligence` repository.
5. Configure your build settings:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)
6. Under **Environment variables**, set (optional if needed):
   - `NODE_VERSION`: `20` (or `18`)
7. Click **Save and Deploy**. Cloudflare Pages will automatically build and distribute the app on Cloudflare's global edge network.

> **Note on Routing**: The repository includes `public/_redirects` which instructs Cloudflare Pages to redirect all routes to `index.html` (HTTP 200), ensuring single-page routing works seamlessly on deep page refreshes.

---

### Option 2: Deploy using Cloudflare Wrangler CLI

You can also deploy directly from your local terminal using Cloudflare Wrangler:

```bash
# 1. Install dependencies and build the static assets
npm install
npm run build

# 2. Deploy to Cloudflare Pages using Wrangler
npx wrangler pages deploy dist --project-name=weather-intelligence
```

A `wrangler.toml` file is included in the project root:
```toml
name = "weather-intelligence"
compatibility_date = "2024-09-01"
pages_build_output_dir = "dist"

[assets]
directory = "./dist"
```

---

## 💻 Local Development

To run the application locally on your machine:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd weather-intelligence

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### Additional Scripts

- `npm run build`: Builds the production-ready static bundle into the `dist/` directory.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs TypeScript compiler check (`tsc --noEmit`) to ensure type safety.
