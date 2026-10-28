# Development Workflows & Quality Gate

This document outlines standard developer workflows, testing conventions, and the mandatory verification checklist for AI agents.

---

## 1. Extension Recipes

### A. How to Add a New Frame Color
1. Open `src/data/frames.ts`.
2. Append a new `Frame` object to the `frames` array:
   ```ts
   {
     id: 'terracotta',
     name: 'Đất nung',
     nameEn: 'Terracotta',
     background: '#D47E6A',
     ink: '#2B1612',
     stage: '#C7735F',
   }
   ```
3. Open `src/App.css` and add any necessary CSS styling for preview cards:
   ```css
   .mini-strip--terracotta {
     background-color: #D47E6A;
     color: #2B1612;
   }
   ```
4. Verify both the DOM preview `<MiniStrip />` and the Canvas export in `createStrip()` render cleanly.

### B. How to Add a New Photo Filter
1. Open `src/data/frames.ts`.
2. Append to `photoFilters`:
   ```ts
   {
     id: 'emerald',
     nameVi: 'Ngọc bích',
     nameEn: 'Emerald',
     cssFilter: 'hue-rotate(-15deg) saturate(1.2) contrast(1.1)',
   }
   ```
3. The filter automatically populates the Studio filter bar and live camera switcher.

### C. How to Add or Modify Translation Strings
1. Open `src/lib/i18n.ts`.
2. Add the key simultaneously to both `translations.vi` and `translations.en`.
3. Reference in components via `t.yourNewKey`.

---

## 2. Unit Testing Conventions (`src/App.test.tsx`)
- **Engine**: Vitest + React Testing Library + `jsdom`.
- **Setup**: `vitest.setup.cjs` provides Node mocks for browser APIs.
- **Rules**:
  - Always mock `Element.prototype.scrollIntoView = vi.fn()` in `beforeEach()`.
  - Always clean up via `cleanup()` and `vi.unstubAllGlobals()` in `afterEach()`.
  - Use accessible queries (`getByRole`, `getByLabelText`, `getByPlaceholderText`).

---

## 3. Mandatory Pre-Delivery Quality Gate
Before completing any task, execute the full validation chain:

```bash
# 1. Fast linter check (oxlint) - must return 0 warnings, 0 errors
npm run lint

# 2. TypeScript compilation check
npm run typecheck

# 3. Unit test execution
npm test

# 4. Production bundle build
npm run build
```

---

## 4. Visual Verification Checklist
When testing with a browser subagent or live environment:
- [ ] Viewport 390x844 (Mobile-first check): Photostrip fits comfortably without vertical clipping.
- [ ] Viewport 1280x800 (Desktop check): Ambient blurred background renders correctly.
- [ ] Language toggle: Switching between VI and EN updates all labels seamlessly.
- [ ] Single-slot retake drawer: Tapping a slot opens `.slot-action-drawer` with active slot highlight.
- [ ] Sound toggle: Muting sound prevents Web Audio execution without console errors.
