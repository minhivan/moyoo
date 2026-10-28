# moyoo

Frontend MVP for a Korean inspired photobooth. React + TypeScript + Vite, Tailwind CSS, Radix Dialog, and local browser image processing. No account, backend, or Supabase connection yet.

## Run

```bash
npm install
npm run dev
```

Open the localhost address printed by Vite. The studio needs a camera and permission from the browser. Camera access works on `localhost` or HTTPS. If permission was blocked, enable it in the browser's site settings and retry.

## Current flow

1. Pick one of four local frames.
2. Allow the camera and take four photos, each with a three second countdown.
3. Preview the strip and download a PNG.

Photos remain only in page memory. Refreshing or closing the page loses them. The decorative sample art in the landing and frame cards is local CSS, not stock photography. The PNG is assembled with Canvas in the browser. No upload takes place.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project map

- `docs/`: modular AI agent documentation harness (architecture, canvas pipeline, design system, workflows)
- `src/App.tsx`: landing and studio states, slot retakes, and export suite
- `src/data/frames.ts`: frame colors, filters, templates, stamps, and paper finishes
- `src/lib/photo.ts`: 300DPI canvas assembly, deboss signatures, single cut exports, and clipboard copy
- `src/lib/sound.ts`: offline Web Audio shutter, motorized film advance, and tactile clicks
- `src/lib/i18n.ts`: bilingual Vietnamese & English translation dictionaries
- `src/App.css`: responsive visual system and micro-animations
- `skills/`: local, reusable agent guidance for feature work and visual review

For a later Supabase phase, add a typed data adapter and decide explicitly whether sessions/photos should be persisted. Do not place service role keys in browser code.
