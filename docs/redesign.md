# Recruiting portfolio redesign

## Goal and direction

Make Majock's embedded software and systems experience understandable in a quick scan, then give technical reviewers enough detail to follow the work. Keep the existing static HTML/CSS/JavaScript deployment and custom domain.

Visual direction: preserve the original minimalist 8-bit identity. Dark background, pixel headings, readable monospace body copy, restrained lavender accents, and compact project rows. Keep technical detail optional in native disclosures, including on touch devices. No framework or production build dependency is needed.

## Content evidence (reviewed September 18, 2026)

- **Resume supplied by Majock:** education, role dates, eight-person team leadership, 400 kHz I2C / DMA work, 1 Mbit/s CAN network, Physio PCB iteration and sponsorship, and Spectrum performance claims.
- **McMaster-Exoskeleton/exoskeleton-embedded:** README, joint-controller documentation and firmware support the STM32, IMU, CAN and motor-control descriptions. Present this as team work and identify Majock's contribution.
- **majockbim/physio:** README and embedded source support the dual-IMU / ESP32-C3 / BLE / iOS pipeline. Label it a rehabilitation prototype. Keep the solo PCB iteration distinct from the hackathon team project. The stated 80 Hz is a nominal rate, not a new measurement.
- **majockbim/spectrum:** README and FFT / render / shared-buffer code support the audio pipeline. Performance numbers are reported project results, not independently reproduced benchmarks. Avoid live star/download counts that become stale.
- **majockbim/lodestone:** README and simulator implementation support a single-dipole magnetic-field calculation. The OpenGL entry point initializes a window; do not present it as a finished interactive 3D visualizer. Mark it in development.

Use the supplied resume PDF unchanged as the downloadable resume. Reuse the portfolio's real project images. Do not infer employment availability dates or measured improvements beyond the supplied evidence.

## Commit progression

1. Document the redesign and content evidence.
2. Rebuild the page around an accessible, responsive visual foundation and project summaries.
3. Add technical project details, resume access and light progressive enhancement.
4. Verify behavior, accessibility, links and responsive layouts; document maintenance and checks.

## Acceptance criteria

- A reviewer can find the work, technical focus, resume, GitHub and email immediately.
- All four supplied projects are represented with accurate status and working source links.
- Essential content and navigation work without JavaScript.
- Keyboard focus, reduced motion, small screens and browser zoom are supported.
- No hover-only content, continuous background animation or third-party location lookup is needed.
- Prioritize phones, tablets, keyboard access, and narrow landscape windows alongside desktop. Keep the visible page concise.
- Keep CNAME and the production branch intact; push only the feature branch for review.
