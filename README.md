# Tessa Rouse Portfolio

Personal and professional portfolio for Tessa Rouse, built with Astro.

## Development

```sh
npm install
npm run dev
```

The local development server defaults to `http://localhost:4321`.

## Production build

```sh
npm run build
npm run test:site
npm run preview
```

## Content

Structured writing and project content lives under:

- `src/content/writing/`
- `src/content/projects/`

Collection schemas are defined in `src/content.config.ts`.

## Deployment

The production site is deployed from GitHub through Cloudflare. Keep production changes on a feature branch until they have been reviewed and are ready to merge into `main`.

## Quality checks

Every pull request and push to main runs the site quality workflow (.github/workflows/site-quality.yml):
- Install locked dependencies and build the site.
- Audit generated HTML for broken internal links, images missing alt attributes, and missing basic page landmarks.
- Check desktop and mobile viewport widths, mobile menu behavior, and automated WCAG A/AA violations in Chromium.

The browser checks use pinned CI-only Playwright and axe dependencies without changing production dependencies. Automated checks do not replace manual keyboard or screen-reader testing. To run browser checks locally, install the versions listed in the workflow, install Chromium, build, and run npx playwright test.

## Portfolio upkeep

Follow docs/MAINTENANCE.md for a brief monthly review and updates after confirmed academic or professional milestones. Label pending roles or placements as unconfirmed. Review a pull-request preview before merging to main.
