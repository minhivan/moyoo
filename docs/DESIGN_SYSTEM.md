# Design System & Aesthetic Tokens

This document details the visual philosophy, typography, tokens, material finishes, and Web Audio synthesis in `moyoo`.

---

## 1. Aesthetic Philosophy
- **Inspiration**: Tactile industrial hardware (Leica, Teenage Engineering) and traditional analog darkroom crafts.
- **Aesthetic Tenet**: "Warm Editorial Minimalism" — clean utilitarian layouts, tactile micro-borders, authentic physical materiality.
- **Zero AI Clichés**: No sparkles (✦, ✨), no glowing purple/neon gradients, no fake marketing copy.

---

## 2. Typography Mandate
- **Single Universal Font**: `'Google Sans Flex'` across all UI elements, headings, buttons, and Canvas text.
- **Imported in `index.html`**:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,400;500;600;700;800&display=swap" rel="stylesheet">
  ```
- **CSS Declaration**:
  ```css
  :root {
    --font-app: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  ```

---

## 3. Color Tokens
Defined in `:root` of `src/App.css`:

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| `--bg-page` | `#F5F3EF` | Ambient backdrop for desktop viewport |
| `--bg-app` | `#FFFFFF` | Mobile shell container background |
| `--bg-subtle` | `#F0EDE6` | Recessed trays, staging card, tab pill track |
| `--bg-hover` | `#EBE7DF` | Button hover & active tactile states |
| `--text-main` | `#141413` | Primary copy, heavy headings, active frames |
| `--text-muted` | `#66635D` | Secondary labels, descriptions, inactive tabs |
| `--text-subtle` | `#99958E` | Placeholder text, timestamps, slot indices |
| `--border-light` | `#E7E3DC` | Subtle card dividers and slot borders |
| `--border-strong`| `#CCC7BD` | Active state outlines and focus rings |

---

## 4. Material Paper Finishes (`PaperFinish`)

| Finish (`id`) | Visual Simulation in CSS | Purpose |
| :--- | :--- | :--- |
| `'matte'` | Default diffuse surface, soft shadow | Standard fine art matte photo paper |
| `'glossy'` | `.mini-strip--glossy .mini-strip__sheen`: linear-gradient 135deg specular highlight with inset edge sheen | Resin-coated glossy darkroom print |
| `'fiber'` | `.mini-strip--fiber`: radial-gradient 4px fiber dot matrix | Raw textured fiber paper |

---

## 5. Chemical Development Simulation
Simulates the chemical exposure of photographic paper in a darkroom:
```css
@keyframes photoDevelopTone {
  0%   { filter: brightness(2.2) contrast(0.6) saturate(0.2); transform: scale(0.98); }
  60%  { filter: brightness(1.2) contrast(0.9) saturate(0.8); }
  100% { filter: brightness(1) contrast(1) saturate(1); transform: scale(1); }
}

@keyframes chemicalFlashFade {
  0%   { opacity: 0.85; }
  40%  { opacity: 0.45; }
  100% { opacity: 0; }
}
```

---

## 6. Web Audio Synthesizer (Offline Sound Design)
Located in `src/lib/sound.ts`. Requires zero external audio files and runs completely offline.

1. **`playShutterSound()`**:
   - Curtain opening: Triangle wave, frequency ramp `1400Hz -> 150Hz` over `35ms`.
   - Curtain closing clack: Sine wave, frequency ramp `950Hz -> 90Hz` at `55ms -> 120ms`.
2. **`playFilmAdvanceSound()`**:
   - Motorized winding whirr: Dual oscillators (`180Hz -> 280Hz` triangle wave + `90Hz` low hum) over `280ms`.
3. **`playTapSound()`**:
   - Micro tactile click: Sine wave, frequency ramp `1800Hz -> 300Hz` over `20ms`.
