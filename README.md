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

The suite covers Chromium, Firefox, WebKit, and emulated Android, iPhone, and iPad profiles. It checks local assets and the PDF, native details, keyboard entry, 320–1920 px layouts, landscape, 200% CSS zoom, missing-font fallback, no JavaScript, reduced motion, and automated accessibility rules. Emulation complements physical-device review; it does not replace it.

## Edit

- `index.html`: profile, current roles, project summaries, optional details, and links.
- `css/styling.css`: colors, the VT323 terminal face, spacing, and responsive layouts.
- `assets/Majock_Bim_Resume.pdf`: the downloadable resume. Replace this file when updating the resume.
- `assets/fonts/`: locally served VT323 and its SIL Open Font License.
- Project `*.webp` files: optimized previews. Original PNGs remain available as sources.
- `docs/redesign.md`: content evidence and design intent.

Keep role dates and project status current. Performance numbers in project details are reported results, not live benchmarks. Project titles link to source; native **Details** controls reveal technical contributions and images on touch, mouse, and keyboard.

## Hosting

Serve the repository root as static files, as before. Keep `CNAME` (`majockbim.com`) intact. The feature branch is for review; merging or deploying is a separate decision. Node dependencies and browser test reports are development-only and are not required to serve the site.
