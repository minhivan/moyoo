# moyoo — Documentation Hub (AI Agent Harness)

Welcome! This directory is the **authoritative knowledge harness** for AI agents working on `moyoo`. It is designed to be lightweight, modular, and token-efficient to prevent context window overflow while preserving complete architectural memory.

---

## 1. Project Overview & Core Identity
- **Product**: `moyoo` — A boutique, tactile browser photobooth inspired by modern analog craft (Leica, Teenage Engineering) and 35mm darkroom aesthetics.
- **Tech Stack**: React 18 + TypeScript + Vite + Vanilla CSS (No Tailwind CSS runtime dependency) + Radix UI Dialog + Lucide Icons.
- **Scope & Boundary**: **100% Frontend & Client-Side**. Zero server, zero database, zero Supabase. All image processing happens in local browser memory via HTML5 Canvas. Photos are never uploaded or persisted to any cloud.

---

## 2. Invariants & Strict Rules (DO NOT BREAK)
When modifying this codebase, AI agents **MUST** respect the following rules:

1. **Single Font Mandate**:
   - The entire app MUST use only `'Google Sans Flex'`.
   - Never introduce secondary fonts (Inter, Roboto, Serif, etc.).
   - Canvas text rendering (`context.font`) MUST specify `"Google Sans Flex", sans-serif`.
2. **Zero AI Clichés**:
   - No robotic sparkles or AI emojis (e.g., ✦, ✨, 🪄).
   - No generic marketing fluff. Keep copy short, friendly, and primarily Vietnamese (with English toggle).
3. **Local Privacy Boundary**:
   - Never introduce backend endpoints, analytics tracking, or cloud storage without explicit product instruction.
   - Always stop camera media tracks upon leaving the camera screen or unmounting.
4. **Clean Verification Gate**:
   - Before completing any task, execute:
     ```bash
     npm run lint        # oxlint (must be 0 errors, 0 warnings)
     npm run typecheck   # tsc -b
     npm test            # vitest unit tests
     npm run build       # vite build
     ```

---

## 3. Documentation Index & Map
Read only the document relevant to your active subtask to conserve tokens:

| Document | Purpose & Content | Approx. Tokens |
| :--- | :--- | :--- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | State machine, screen navigation flow, media stream lifecycle, surgical slot retake. | ~700 |
| [CANVAS_PIPELINE.md](./CANVAS_PIPELINE.md) | High-res 300DPI canvas math, 1x4 and 2x2 grid rendering, deboss signatures, single cuts. | ~800 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Color tokens, typography, paper finishes, Web Audio synthesizer (shutter/film advance). | ~700 |
| [DATA_MODELS.md](./DATA_MODELS.md) | Catalog types (`Frame`, `PhotoFilter`, `Template`, `Stamp`, `PaperFinish`, `i18n`). | ~600 |
| [WORKFLOWS.md](./WORKFLOWS.md) | How to add frames/filters, update UI, write unit tests, and pre-commit checks. | ~600 |

---

## 4. Key Directory Structure
```
moyoo/
├── docs/                   # AI Agent Documentation Harness (Modular & Token-Optimized)
├── skills/                 # Local workspace agent skills
├── public/                 # Static assets (sample photos for preview)
├── src/
│   ├── data/
│   │   └── frames.ts       # Frame colors, filters, templates, stamps, paper options
│   ├── lib/
│   │   ├── photo.ts        # Canvas capture, 300DPI composition, single cuts, clipboard copy
│   │   ├── sound.ts        # Web Audio synthesizer (shutter, film advance, tactile taps)
│   │   └── i18n.ts         # Bilingual translations (Vietnamese & English)
│   ├── App.tsx             # Main application orchestrator & state machine
│   ├── App.css             # Tactile studio design system & micro-animations
│   ├── App.test.tsx        # Vitest suite for UI & user interactions
│   └── main.tsx            # React root mount
├── package.json
└── vite.config.ts
```
