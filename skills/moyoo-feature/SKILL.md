---
name: moyoo-feature
description: Extend the moyoo photobooth frontend flow, frames, capture, or export while preserving the current browser-only product boundary.
---

# Moyoo feature work

Read `AGENTS.md` and the current UI flow before editing. Identify the user-visible state transition being changed and its failure or retry path. Keep frame content in `src/data/frames.ts`, browser capture/export logic in `src/lib/photo.ts`, and presentation in components/CSS. Keep photos in memory unless persistence is explicitly requested; communicate that a refresh loses them. For camera changes, check permission denial, unavailable devices, track cleanup, countdown cancellation, and mobile layout. Verify with the repository scripts and state what still needs a real browser and camera.
