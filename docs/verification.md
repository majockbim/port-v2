# Verification · motion and content refinement · September 18, 2026

Final local result: **48 Playwright checks passed** across Chromium, Firefox, WebKit, and emulated Pixel 7, iPhone 13, and iPad Mini profiles.

## Coverage

- Exact Minecraft Regular font loads from the local OTF file.
- Resume returns a valid PDF; all referenced local assets return successfully.
- Project rows link directly to their repositories and keep descriptions visible.
- Spectrum uses the original animation, resized to 80 pixels: all 300 frames, frame delays, and infinite-loop setting are preserved. Transfer size is 534,639 bytes versus 6,647,391 bytes for the original.
- Spectrum's white title crossfades into the rainbow on hover and keyboard focus. A midpoint opacity assertion verifies the transition instead of only its final state.
- The native pause checkbox freezes the rainbow and background bits and shows a static Spectrum icon.
- Reduced motion suppresses the animated GIF request, rainbow animation, background drift, and hover transitions, even without JavaScript.
- Exoskeleton appears as a current role, with three project rows. LA Hacks 2026 and UCLA are restored under Previously. The PCBWay sponsorship is visible on wide displays and hidden on phones.
- Layouts from 320 to 1920 CSS pixels, portrait and landscape, and 200% CSS zoom have no horizontal overflow. Side previews are anchored within the viewport.
- Missing-font fallback, keyboard activation, and skip-link destination focus work. WebKit link focus is set explicitly because link tabbing follows platform keyboard preferences.
- Automated axe WCAG A/AA checks report no violations in the default and Spectrum-focus states.
- Desktop, phone, and Spectrum-hover screenshots were visually reviewed.

These are browser and device-emulation checks, not physical iOS/Android hardware tests or an exhaustive accessibility audit. External destination uptime is not asserted by the local suite.

Run `npm test` to reproduce. Tests use their own server on port 4174, separate from the preview on 4173. CNAME and the supplied resume PDF are unchanged. No deployment or merge is part of this branch.
