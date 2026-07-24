# TerraVision AI — Smart City Digital Twin

TerraVision AI is an enterprise-grade, highly interactive 3D Smart City Digital Twin platform designed to support and monitor Sustainable Development Goals (**SDG 9**: Industry, Innovation, and Infrastructure, **SDG 11**: Sustainable Cities and Communities, and **SDG 13**: Climate Action).

## 🚀 Key Features

- **Futuristic 3D Smart City View**: Interactive, high-fidelity WebGL digital twin rendering buildings, roads, parks, rivers, moving vehicles, and sustainable power grids (wind & solar farms).
- **Day/Night Cycle & Simulation**: Interactive hour timeline altering sunlight, street lighting, ambient sounds, and municipal energy consumption metrics.
- **Smart Infrastructure Overlays**: Interactive toggles to map the electricity grid, water supply network, public transport links, internet coverage, and evacuation routing.
- **AI Climate Prediction Panel**: Real-time environmental sensing projections for flood risks, drought potential, pollution patterns, and heatwave hazards.
- **Disaster Simulation Engine**: Live visual simulations of environmental stressors (Normal, Flood, Earthquake, Heatwave, Heavy Rainfall).
- **SDG Impact Monitor**: Comprehensive tracking charts measuring real-time alignment with SDG targets.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Rendering**: Three.js + React Three Fiber (R3F) + Drei
- **State Management**: Zustand
- **Data Querying**: TanStack Query (React Query) v5
- **Visual Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database / Stream**: Supabase (PostgreSQL, Realtime APIs)
- **Charts**: Recharts

---

## 📁 Directory Structure

```
app/
  (landing)/                # Welcome page & cinematic loading sequence
  dashboard/                # Glassmorphic digital twin monitoring environment
    overview/               # Central control dashboard & 3D canvas
    city/                   # Infrastructure grid management
    climate/                # Climate simulation control
    disaster/               # Disaster warning operations
    analytics/              # Aggregated metrics & data visualizer
    sdgs/                   # SDG 9, 11, 13 tracking index
    settings/               # System presets & visual options
  api/                      # Next.js API route handlers

components/
  ui/                       # Shadcn/ui core components
  layout/                   # Layout wrappers (Sidebar, Top navbar)
  dashboard/                # Dashboard panels (KPI cards, predictions)
  charts/                   # Chart wrapper library (Recharts)
  common/                   # Shared UI helper templates

features/                   # Feature-specific state machines/hooks
  smart-city/               # City zoning & traffic logic
  climate/                  # Environment stats & forecasting rules
  disaster/                 # Disaster simulation shaders & control
  sdgs/                     # Metric calculations

three/                      # 3D Graphics pipelines
  scene/                    # R3F Canvas & lighting setup
  city/                     # Mesh assembly control
  buildings/                # Glowing procedural shaders
  environment/              # Rivers, forests, weather particles
  roads/                    # Dynamic vehicle pathways
  effects/                  # Post-processing filters

services/                   # External API services (Supabase, OpenAI)
hooks/                      # Custom hooks (e.g. useMounted, useKeyboard)
store/                      # Zustand state store
types/                      # Type definitions
lib/                        # Third party client instantiations
utils/                      # Shared styling & math helpers
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build and Check Types
```bash
npm run build
```
