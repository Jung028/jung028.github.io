# Adam Lim — Portfolio

Personal portfolio site, live at [jung028.github.io](https://jung028.github.io). A single-page React app showcasing experience, education, and projects (with video demos), plus live GitHub activity.

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool, dev server)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix-based components)
- [Motion](https://motion.dev/) for scroll-triggered animations
- [next-themes](https://github.com/pacocoursey/next-themes) for the dark/light theme toggle
- [cmdk](https://cmdk.paco.me/) (via shadcn's `Command` primitive) for the `⌘K` command palette
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit/component tests, [Playwright](https://playwright.dev/) for e2e tests

## Local development

This project uses [Bun](https://bun.sh) as the package manager and script runner.

```bash
bun install       # install dependencies
bun run dev       # start the dev server at http://localhost:8080
bun run build     # production build to dist/
bun run test      # run the unit/component test suite (Vitest)
bunx playwright test  # run the e2e test suite
bun run lint      # lint with ESLint
```

## Project structure

```
src/
  App.tsx                  # providers (theme, query client, router) + route table
  pages/
    Index.tsx               # the main single-page layout, composes all sections
    ProjectDetail.tsx        # per-project deep-dive page (/projects/:slug)
    NotFound.tsx
  components/
    Hero.tsx, About.tsx, Experience.tsx, Education.tsx,
    Projects.tsx, LittleAboutMe.tsx, Footer.tsx    # page sections
    AppSidebar.tsx           # left navigation sidebar
    CommandPalette.tsx       # ⌘K / Ctrl+K command palette
    CustomCursor.tsx         # custom cursor (desktop/mouse only)
    ThemeToggle.tsx          # dark/light theme switch
    GithubStatsCard.tsx      # live GitHub stats, shown in Little about me
    VideoLightbox.tsx        # video modal used on ProjectDetail
    ui/                      # shadcn/ui primitives (do not hand-edit; regenerate via shadcn CLI if needed)
  hooks/
    useGithubStats.ts, useReducedMotion.ts, use-mobile.tsx
  lib/
    motion-variants.ts       # shared Motion animation variants
    utils.ts                 # `cn()` class-merging helper
  assets/                   # images/videos, organized per project/section
e2e/
  interactive-portfolio.spec.ts   # Playwright end-to-end coverage
```

## Adding a new project card

Project data lives in `src/components/Projects.tsx` in the `projects` array — add a new entry with `title`, `description`, `tags`, `github`, `category`, `thumbnail`, and `videos`. Put its media assets under `src/assets/Projects/<project-name>/`. If the project should get its own deep-dive page (like the existing AI-Payment-Chargeback project), add an entry to `PROJECT_EMBEDS` in `src/pages/ProjectDetail.tsx` and set `slug` to match.

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which builds the site (`npm run build` in CI) and deploys the `dist/` output to GitHub Pages automatically. No manual deploy step is needed.

Future Improvement

- 