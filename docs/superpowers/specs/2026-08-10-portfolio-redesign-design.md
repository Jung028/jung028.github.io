# Portfolio Interactive Redesign — Design

## Goal

Layer advanced, developer-signaling interactivity onto the existing portfolio site (`jung028.github.io`, this repo) without discarding its current visual identity, and replace the placeholder README with real project documentation.

## Context

This repo (`main`) is a Lovable-generated React + TypeScript + Vite + Tailwind + shadcn/ui site with a Spotify-inspired dark aesthetic: large circular profile photo, "Verified Engineer" badge, `bg-black` / Spotify-green (`--primary: 141 73% 42%`) tokens, sidebar navigation (`AppSidebar`), and real content — video-backed project cards (Gatekeep, iPay, SunDog, Tracely), a downloadable resume PDF, and per-project detail pages (`ProjectDetail.tsx`).

It already has `cmdk` and `next-themes` as dependencies, but neither is wired up anywhere in the app — they're unused scaffold leftovers. There is no scroll animation, no command palette, no theme toggle (dark-only, no light theme values defined), and no custom cursor. `README.md` is the untouched Lovable template (`# Welcome to your Lovable project` / `TODO: Document your project here`).

Earlier in this design process a different, stale local branch (`feature/new-personal-website`, deleted on GitHub, a much older plain-CSS/JS scaffold) was mistakenly the starting point before this was caught and local `main` was reset to match `origin/main`. This spec is written against the real, current `main`.

## Decisions

- **Keep the existing Spotify-inspired visual identity.** Do not replace it — layer interactivity on top.
- **Keep all existing content** (About/Experience/Projects/Education/Contact copy, project data). This is a UI/interaction redesign, not a content rewrite.
- **Animation library: Motion (Framer Motion).** New dependency.
- **Styling: continue using Tailwind + shadcn/ui + CSS custom properties** — the codebase's existing convention. No new styling system introduced.
- **Features to add:** scroll-driven reveal animations, a `⌘K`/`Ctrl+K` command palette, a custom cursor (desktop/mouse only), live GitHub stats, a dark/light theme toggle.
- **Documentation:** replace `README.md` entirely with real project docs.

## Architecture

### New files

| File | Responsibility |
|---|---|
| `src/lib/motion-variants.ts` | Shared Motion variants (`fadeInUp`, `staggerContainer`) so every section animates consistently |
| `src/hooks/useReducedMotion.ts` | Wraps `prefers-reduced-motion`; when true, variants skip to end state (no motion) |
| `src/hooks/useGithubStats.ts` | Fetches public GitHub API data for `Jung028`; exposes `{ data, status }` (`status`: `loading`/`success`/`error`) |
| `src/components/GithubStatsCard.tsx` | Renders repo/follower counts + recently-pushed repos from `useGithubStats`; renders a static fallback on `error` status |
| `src/components/CommandPalette.tsx` | Built on existing `src/components/ui/command.tsx` (shadcn/cmdk). Global keydown listener for `⌘K`/`Ctrl+K`. Items: jump to section, open project pages, external links (GitHub/LinkedIn/Resume), toggle theme |
| `src/components/CustomCursor.tsx` | Dot + trailing ring following the pointer via Motion springs; scales on `[data-cursor-hover]` elements; no-ops entirely under `matchMedia('(pointer: coarse)')` |
| `src/components/ThemeToggle.tsx` | Sun/moon icon button using `next-themes`' `useTheme()` |

### Modified files

| File | Change |
|---|---|
| `src/App.tsx` | Wrap tree in `next-themes`' `ThemeProvider` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`). Mount `<CommandPalette/>` and `<CustomCursor/>` once, outside `<Routes>`, so both work across routes |
| `src/pages/Index.tsx` | Add `<ThemeToggle/>` to the header icon row (next to Resume/GitHub/LinkedIn) |
| `src/components/About.tsx`, `Experience.tsx`, `Projects.tsx`, `LittleAboutMe.tsx` | Wrap existing content blocks in `motion.div` using `whileInView` + shared variants from `motion-variants.ts`. No content or markup restructuring — animation wrapping only |
| `src/components/LittleAboutMe.tsx` | Also mounts `<GithubStatsCard/>` at the end of its existing content — thematically the "personal/now" section, so live GitHub activity fits alongside it rather than needing a new top-level section |
| `src/index.css` | Add light-theme CSS variable values under `:root`; move current (dark) values to an explicit `.dark` rule so today's default appearance is unchanged. Define the previously-undefined `--glow`, `--glow-secondary`, `--surface-glass` variables so `.text-glow`/`.box-glow`/`.box-glow-accent`/`.glass` utilities (currently dead) work |
| `README.md` | Full rewrite — see Documentation section below |

### Removed

- `src/components/Navbar.tsx` — unused dead code, superseded by `AppSidebar`. Confirmed via repo-wide grep: no imports outside its own file.

## Interactive Features

**Scroll-driven animations.** Section content blocks get `whileInView` reveals via shared `fadeInUp`/`staggerContainer` variants from `motion-variants.ts`. `useReducedMotion()` gates this — when `prefers-reduced-motion: reduce`, variants render in their end state immediately (`initial === animate`, no transition).

**Command palette.** `CommandPalette.tsx` renders `ui/command.tsx`'s `CommandDialog`, toggled by a `keydown` listener for `Cmd/Ctrl+K` (and closable via `Escape`, click-outside — both already handled by the shadcn primitive). Items are static: section anchors, project detail routes, external links, and a "Toggle theme" action.

**Custom cursor.** `CustomCursor.tsx` tracks `pointermove`, positions a small dot + a spring-lagged ring via Motion's `useSpring`. Interactive elements needing the hover-scale effect get a `data-cursor-hover` attribute (buttons, links, project cards). The component checks `matchMedia('(pointer: coarse)')` once on mount and renders `null` if true — touch devices get zero custom-cursor code running.

**Live GitHub stats.** `useGithubStats.ts` calls `https://api.github.com/users/Jung028` and `https://api.github.com/users/Jung028/repos?sort=pushed&per_page=5`, unauthenticated (GitHub allows 60 req/hr per IP for unauthenticated REST calls — sufficient for a personal portfolio's traffic). On non-2xx response (including 403 rate-limit) or network failure, `status` becomes `error` and `GithubStatsCard` renders a static, non-live version of the same layout — no visible error state, since this is decorative content.

**Theme toggle.** `next-themes` handles persistence (localStorage) and applying/removing the `dark` class on `<html>` automatically — no custom persistence code needed. Default remains dark (`defaultTheme="dark"`), matching current site behavior for anyone who never touches the toggle.

## Testing

Vitest + Testing Library and Playwright are already configured in this repo (`src/test/setup.ts`, `playwright.config.ts`). New tests:

- `src/hooks/useGithubStats.test.ts` — mocked `fetch`; asserts `loading` → `success` and `loading` → `error` transitions
- `src/components/ThemeToggle.test.tsx` — click toggles the `dark` class on `document.documentElement` and persists via `next-themes`' storage key
- `src/components/CommandPalette.test.tsx` — `Cmd+K` opens the dialog, typing filters the item list, `Enter` on a section item scrolls/navigates and closes the dialog
- One Playwright e2e spec (`e2e/interactive-portfolio.spec.ts`): page loads → `Cmd+K` opens palette and navigates → theme toggle switches and persists across reload → a section gains its "in-view" animation state on scroll

## Continuous Testing Hook

This repo has no `.claude/settings.json` hook configured. Per the project's standing requirement, the implementation plan must add one:

- **Automated Hooks:** a `PostToolUse` hook on `Write`/`Edit` fires on every file save.
- **Continuous Testing:** the hook runs `bun run build`, `bun test`, and `tsc --noEmit`.
- **Autonomous Correction:** on failure, the implementer sees the output immediately and fixes it before moving on — the user should always see a green state.

## Documentation Fix

Replace `README.md` entirely with:
- What the site is (Adam Lim's portfolio, live at `jung028.github.io`)
- Tech stack: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Motion, `next-themes`, `cmdk`
- Local dev commands: `bun install`, `bun run dev`, `bun run build`, `bun test`, `bun run lint`
- Project structure overview (pages/components/hooks/lib, where project data and assets live)
- How to add a new project card (points at `Projects.tsx` and `src/assets/Projects/<name>/`)
- Deployment: existing GitHub Actions workflow (`.github/workflows/static.yml`) builds and deploys `dist/` to GitHub Pages on push to `main`

## Out of Scope

- No content/copy changes to resume sections
- No visual redesign of the existing Spotify-inspired identity
- No changes to the GitHub Actions deploy workflow
- No authenticated GitHub API usage (stats are best-effort, public, unauthenticated)
