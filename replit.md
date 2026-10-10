# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a backend API server and a Bhoomi mobile app (React Native / Expo).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Bhoomi - Smart Irrigation Mobile App (`artifacts/bhoomi`)
React Native Expo app for farmers in Maharashtra, India.

**Features:**
- 11 screens: Splash, Login, Home Dashboard, Zone Map, Irrigation Control, Fertigation, Solar Energy, Water Analytics, Crop Details, Alerts, Settings
- 4 zones (Zone A-D) with real-time valve toggle via Zustand state
- i18n: Marathi (default), Hindi, English — instant language switching
- Zustand store with all dummy data (zones, alerts, weather, solar, NPK, water analytics)
- Bottom tab navigation: Home, Zones, Analytics, Alerts, Settings
- Stack navigation for Splash → Login → Main App
- Color coding: green=good, amber=warning, red=critical, blue=info

**Color Palette (Bhoomi theme):**
- Primary Green: #1B5E20
- Medium Green: #2E7D32  
- Light Green: #4CAF50
- Background: #F5F5F0
- Soil Brown: #5D4037

**Farmer Data:** Ramesh Shinde, Vadale Pune, 4 Acre, 4 Zones

**Key Files:**
- `store/useStore.ts` — Zustand store with all dummy data
- `i18n/` — Translations for Marathi, Hindi, English
- `app/(tabs)/` — All tab screens
- `constants/colors.ts` — Bhoomi color palette

### API Server (`artifacts/api-server`)
Shared Express backend.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
