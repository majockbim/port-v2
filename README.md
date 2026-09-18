# Majock Bim · portfolio

A small, static portfolio for embedded software and systems work. Dark, minimal, and a little 8-bit. Production is plain HTML and CSS, with no JavaScript, build step, or external font requests.

## Preview

With Python 3 installed, run this from the repository root:

```sh
python scripts/serve.py
```

Open [localhost:4173](http://localhost:4173). `npm start` runs the same command.

## Check

Node.js 22+ and Python 3 are required for the development checks only:

```sh
npm ci
npx playwright install chromium firefox webkit
npm test
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit` to install browser system dependencies as well. `npm run test:ui` opens Playwright's test UI.

The suite covers Chromium, Firefox, WebKit, and emulated Android, iPhone, and iPad profiles. It checks assets and the PDF, direct project links, Spectrum’s GIF/rainbow effect and pause control, keyboard access, 320–1920 px layouts, landscape, 200% CSS zoom, font fallback, no JavaScript, reduced motion, and automated accessibility rules. Emulation does not replace physical-device review.

## Edit

- `index.html`: profile, current roles, compact project rows, and links.
- `css/styling.css`: colors, the Minecraft Regular face, spacing, and responsive layouts.
- `assets/Majock_Bim_Resume.pdf`: the downloadable resume. Replace this file when updating the resume.
- `assets/fonts/`: the exact Minecraft Regular font from the reference, with designer and license metadata in NOTICE.md.
- Project `*.webp` files: optimized previews. Original PNGs remain available as sources.
- `docs/redesign.md`: content evidence and design intent.

Keep role dates and project status current. Project rows link directly to source. Supplemental image previews appear on hover or keyboard focus on wide screens; the text and links remain available at every size. Spectrum uses a resized copy of the original 300-frame GIF, with a static fallback for reduced motion and a native pause checkbox. The white Spectrum title crossfades into the moving rainbow. Sparse background bits drift slowly using CSS; the same pause checkbox stops them, and reduced motion keeps them static. LA Hacks remains under Previously, Exoskeleton is a current role, and the Physio PCBWay callout appears at widths of 1280px and above.

## Hosting

Serve the repository root as static files, as before. Keep `CNAME` (`majockbim.com`) intact. The feature branch is for review; merging or deploying is a separate decision. Node dependencies and browser test reports are development-only and are not required to serve the site.
