# Taste

- Wants new UI elements (e.g., loaders, overlays) to be visually consistent with the app's existing design language rather than generic/off-brand — e.g., explicitly asked that a page-transition loader be "similar to the visual design." Confidence: 0.6

- Prefers styling to be expressed with Tailwind CSS utilities rather than custom handwritten CSS classes — asked to convert newly added custom loader CSS into Tailwind (v4 `@theme` tokens + `animate-*` utilities, inline arbitrary values for per-element delays). Confidence: 0.7

- Considers a full app sidebar incorrect UX on focused/immersive pages (e.g., the repo chat workspace) — prefers lighter, context-specific navigation (brand link home, breadcrumb/back, slim route-nav bar) that still makes all app routes reachable from every page, so no page is a dead end. Confidence: 0.6

- Uses Zustand for client-side state management (stores such as `user.store.ts`, `ui.store.ts`). Confidence: 0.6
