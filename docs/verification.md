# Verification · September 18, 2026

Final local result: **30 Playwright checks passed**, including axe accessibility scans with no reported WCAG A/AA violations in both collapsed and expanded states.

## Coverage

- Desktop Chromium, Firefox, and WebKit.
- Emulated Pixel 7, iPhone 13, and iPad Mini profiles; native tap disclosure controls.
- Layouts from 320 to 1920 CSS pixels, portrait and landscape, and 200% CSS zoom.
- Project details opened and closed, with successfully decoded previews.
- Keyboard activation, skip-link destination focus, and visible focus styling. WebKit link focus is set explicitly in the test because link tabbing follows platform keyboard preferences.
- JavaScript disabled, reduced motion, and unavailable custom-font fallback.
- Local asset responses, resume PDF response, and loaded VT323 font.
- Visual review of desktop, phone, tablet, small-phone, and expanded phone layouts.

The supplied resume and the published asset have identical SHA-256 hashes. `CNAME` is unchanged. The three WebP previews total 370,028 bytes versus 5,026,879 bytes for the original PNGs (about 93% smaller).

These are automated browser and device-emulation checks, not physical iOS/Android hardware tests or an exhaustive accessibility audit. External destination uptime is not asserted by the local suite.

Run `npm test` to reproduce. Tests use their own server on port 4174, separate from the local preview on 4173. No deployment or merge is part of this branch.
