# Moyoo working agreement

- Product: Korean inspired browser photobooth with a soft Seoul editorial visual style. Keep copy friendly, short, and primarily Vietnamese.
- Current scope: frontend only. Use local data and browser APIs. Do not add Supabase, backend, authentication, or storage without a new product decision.
- Preserve the flow: landing → choose frame → camera permission → four countdown captures → preview → local PNG download.
- Keep frame definitions in `src/data/frames.ts` and image composition in `src/lib/photo.ts`. A future persistence adapter can consume these outputs without making UI components depend on Supabase.
- Camera access requires a user gesture and HTTPS or localhost. Stop media tracks on exit and unmount. Never imply photos are saved remotely.
- Before delivery, run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Browser camera behavior needs a real device and permission; report that separately from source checks.
- Use the local skills under `skills/` for feature work and visual review when they apply.
- Consult the modular knowledge harness in `docs/` (start with `docs/README.md`) for complete technical details, Canvas 300DPI math, state machine, and testing workflows.
