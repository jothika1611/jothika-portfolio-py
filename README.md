# Jothika P — Portfolio

A responsive, single-page portfolio for a Java Backend Developer. Built with plain HTML, CSS and JavaScript — no build step or dependencies.

## Files

```
portfolio_py/
├── index.html              # Page content
├── assets/
│   ├── css/styles.css      # Design system, layout and responsive rules
│   └── js/main.js          # Theme, navigation, reveal animations, copy email
├── Jothika_P_Resume.pdf    # Updated résumé (Squat Skill Analyzer added)
├── Jothika_P_Resume_Original.pdf  # Backup of the original résumé
└── README.md
```

## Run locally

Double-click `index.html`, or serve the folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Features

- Responsive layout for desktop, tablet and mobile
- Dark and light themes (saved in `localStorage`, respects system preference)
- Sticky header with active-section navigation and mobile menu
- Scroll-reveal animations with reduced-motion support
- Copy-email button with clipboard fallback and toast
- Downloadable résumé and direct email/phone/LinkedIn/GitHub links
- Print styles for a clean paper/PDF version
- Semantic HTML, skip link and keyboard focus styles

## Customize

- **Content:** edit the sections in `index.html` (about, skills, experience, projects, education, contact).
- **Colors:** change the CSS custom properties in the `html[data-theme="dark"]` and `html[data-theme="light"]` blocks at the top of `assets/css/styles.css`.
- **Fonts:** the site loads Inter, Sora and JetBrains Mono from Google Fonts. Replace the `<link>` in `index.html` to use different fonts.
- **Résumé:** replace `Jothika_P_Resume.pdf` with an updated file, keeping the same name. The original is preserved as `Jothika_P_Resume_Original.pdf`.
- **Project links:** each project card links directly to its GitHub repository (frontend and backend where applicable).

## Deploy

This is a static site, so it can be hosted on any static host:

- **Vercel:** import the folder/repository — no build command, output directory is the project root.
- **GitHub Pages:** push the files and enable Pages for the branch.
- **Netlify:** drag and drop the folder in the Netlify dashboard.
