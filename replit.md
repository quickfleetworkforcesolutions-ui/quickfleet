# QuickFleet Workforce Solutions

Customer-facing mobile app for QuickFleet — an Indian B2B company offering workforce supply, IT infrastructure, and CCTV/security services.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the Express API proxy server (port 8080)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- Set `EXPO_PUBLIC_API_BASE_URL` to your Spring Boot backend URL (e.g. `http://your-server:8080/api/v1`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54, Expo Router (file-based routing), React Query
- API: Express 5 (proxy/wrapper)
- Caching: AsyncStorage with 5-minute TTL + static fallback
- Forms: Zod validation, expo-document-picker (resume upload)
- Build: esbuild (API server CJS bundle)

## Where things live

- `artifacts/mobile/` — Expo mobile app
  - `app/(tabs)/` — 5 bottom tabs: Home, Services, Careers, Gallery, Contact
  - `app/about.tsx`, `app/industries.tsx` — stack screens
  - `app/service/[slug].tsx` — service detail
  - `app/apply/[slug].tsx` — job application with resume upload
  - `lib/api.ts` — API client with AsyncStorage caching
  - `lib/cms.ts` — CMS section parsing helpers
  - `lib/fallback.ts` — static fallback content (bundled defaults)
  - `context/SettingsContext.tsx` — global app settings from /cms/settings
- `artifacts/api-server/` — Express server (existing scaffold)

## Architecture decisions

- External Spring Boot backend is called directly from the Expo app via `EXPO_PUBLIC_API_BASE_URL`
- No authentication required (public API)
- AsyncStorage caches all API responses for 5 minutes; app shows `NetworkBanner` when serving cached/fallback content
- Static fallback data is bundled in `lib/fallback.ts` so the app is always usable offline
- CMS content parsed via `findSection()` / `getListItems()` helpers in `lib/cms.ts`
- Job applications submitted as `multipart/form-data` using `expo-document-picker`

## Product

- **Home**: CMS-driven hero, stats, about preview, services preview, Why Choose Us, testimonials carousel, CTA
- **Services**: Published service listing with detail pages, "Request a Quote" flow
- **Careers**: Job listings with full application form (name, email, phone, experience, resume upload)
- **Gallery**: Photo grid with category filter (All / HERO / SERVICE / TEAM / EVENTS / PORTFOLIO / OTHER) and lightbox
- **Contact**: Address, phone (tap to call), email (tap to mail), full inquiry form with Zod validation
- **About / Industries**: Stack screens accessible from Home

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Set `EXPO_PUBLIC_API_BASE_URL` environment variable to your Spring Boot backend — without it, the app defaults to localhost and falls back to static content
- expo-document-picker is pinned to ~14.0.8 (Expo SDK 54 compatible)
- API responses must follow `{ success: boolean, message: string, data: T }` envelope — paginated lists use Spring Page format with `content[]`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for Expo-specific guidelines
