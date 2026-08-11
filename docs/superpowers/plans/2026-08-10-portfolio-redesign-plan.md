# Interactive Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer scroll animations, a command palette, a custom cursor, live GitHub stats, and a dark/light theme toggle onto the existing Spotify-inspired portfolio (`jung028.github.io`) without discarding its visual identity, and replace the placeholder README with real project docs.

**Architecture:** Additive component/hook layer on top of the existing React 18 + TypeScript + Vite + Tailwind + shadcn/ui codebase. Existing section components (`About`, `Experience`, `Projects`, `LittleAboutMe`) get wrapped with Motion (`motion/react`) reveal animations rather than restructured. New standalone components (`CommandPalette`, `CustomCursor`, `ThemeToggle`, `GithubStatsCard`) mount once at the app root or inside one existing section. The Spotify dark palette becomes theme-aware via CSS custom properties instead of being replaced.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, shadcn/ui (Radix primitives), `motion` (Framer Motion successor), `next-themes`, `cmdk` (via existing `ui/command.tsx`), Vitest + Testing Library, Playwright.

## Global Constraints

- **Package manager: Bun.** Every install/run command in this plan uses `bun install`, `bun add <pkg>`, `bun run <script>` — never `npm`/`yarn`/`pnpm`. (Source: user's global CLAUDE.md.)
- **Test runner: `bun run test`** (which executes the repo's existing `vitest run` script). This project already has Vitest configured with jsdom + Testing Library; we run it via Bun rather than migrating to Bun's native test runner, since migrating would replace a working, already-configured test setup for no benefit — "follow established patterns in existing codebases."
- **No new styling system.** Tailwind + shadcn/ui + CSS custom properties only. No Tailwind rewrite, no CSS-in-JS.
- **Keep the existing Spotify-inspired dark visual identity as the default.** `defaultTheme="dark"` must render pixel-identical to the current site for anyone who never touches the new theme toggle.
- **No content/copy changes.** All resume text, project descriptions, dates, etc. stay exactly as they are.
- **No changes to `.github/workflows/static.yml`** (the GitHub Pages deploy workflow).
- **Respect `prefers-reduced-motion`** for all Motion-driven animation, and **`(pointer: coarse)`** to disable the custom cursor entirely on touch devices.
- **Continuous testing hook required.** This repo has no `.claude/settings.json` yet. Task 1 adds a `PostToolUse` hook on `Write`/`Edit` that runs the build, test suite, and type checker on every file save, so failures surface immediately instead of at the end.

---

### Task 1: Project Setup — dependencies and continuous testing hook

**Files:**
- Modify: `package.json` (via `bun add`, not hand-edited)
- Create: `.claude/settings.json`

**Interfaces:**
- Produces: a working `node_modules` matching the current `package.json`, the `motion` package available for import as `motion/react`, and a `PostToolUse` hook that all later tasks rely on to catch mistakes immediately.

- [ ] **Step 1: Sync node_modules with the current package.json**

The local `node_modules` is stale (left over from a since-deleted branch with a completely different `package.json`). Reinstall from the lockfile that matches the current `main`:

Run: `bun install`

Expected: install completes without errors; `bun run build` (next step) succeeds.

- [ ] **Step 2: Verify the existing app still builds cleanly before making any changes**

Run: `bun run build`

Expected: exits 0, produces a `dist/` directory. This is our baseline — if this fails, stop and investigate before proceeding, since it means the reinstall didn't fix the environment.

- [ ] **Step 3: Add the Motion animation library**

Run: `bun add motion`

Expected: `package.json` gains a `"motion": "^..."` dependency; `bun.lock` updates.

- [ ] **Step 4: Create the continuous testing hook**

Create `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bun run build && bun run test && bunx tsc --noEmit"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5: Verify the hook actually fires and catches a real failure**

Temporarily introduce a type error to confirm the hook surfaces it: open `src/main.tsx` and change `document.getElementById("root")!` to `document.getElementById("root")` (drop the non-null assertion, which `createRoot` doesn't accept as `HTMLElement | null`), save the file, and confirm the hook's `bunx tsc --noEmit` step reports the type error. Then revert the change (restore the `!`) and save again, confirming the hook now passes cleanly.

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock .claude/settings.json
git commit -m "chore: sync deps, add motion, add continuous testing hook"
```

---

### Task 2: Shared motion utilities

**Files:**
- Create: `src/lib/motion-variants.ts`
- Create: `src/lib/motion-variants.test.ts`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/hooks/useReducedMotion.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `fadeInUp: Variants`, `staggerContainer: Variants` (from `src/lib/motion-variants.ts`) and `useReducedMotion(): boolean` (from `src/hooks/useReducedMotion.ts`) — both consumed by Task 9.

- [ ] **Step 1: Write the failing test for useReducedMotion**

Create `src/hooks/useReducedMotion.test.ts`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("useReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when prefers-reduced-motion does not match", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/hooks/useReducedMotion.test.ts`
Expected: FAIL — `Failed to resolve import "./useReducedMotion"` (file doesn't exist yet).

- [ ] **Step 3: Implement useReducedMotion**

Create `src/hooks/useReducedMotion.ts`:

```tsx
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/hooks/useReducedMotion.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing test for motion-variants**

Create `src/lib/motion-variants.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { fadeInUp, staggerContainer } from "./motion-variants";

describe("motion-variants", () => {
  it("fadeInUp defines hidden and visible states", () => {
    expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 24 });
    expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("staggerContainer staggers its children", () => {
    expect(staggerContainer.visible).toMatchObject({
      transition: { staggerChildren: 0.08 },
    });
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `bun run test src/lib/motion-variants.test.ts`
Expected: FAIL — `Failed to resolve import "./motion-variants"`.

- [ ] **Step 7: Implement motion-variants**

Create `src/lib/motion-variants.ts`:

```tsx
import type { Variants } from "motion/react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};
```

- [ ] **Step 8: Run both test files to verify everything passes**

Run: `bun run test src/lib/motion-variants.test.ts src/hooks/useReducedMotion.test.ts`
Expected: PASS (4 tests total).

- [ ] **Step 9: Commit**

```bash
git add src/lib/motion-variants.ts src/lib/motion-variants.test.ts src/hooks/useReducedMotion.ts src/hooks/useReducedMotion.test.ts
git commit -m "feat: add shared motion variants and reduced-motion hook"
```

---

### Task 3: Design tokens — light theme + global color aliasing

**Context:** `src/index.css` currently defines only dark values on `:root` with no light variant and no `.dark` class rule, despite `tailwind.config.ts` being configured for `darkMode: ["class"]`. Separately, `.text-glow`/`.box-glow`/`.box-glow-accent`/`.glass` utilities reference `--glow`, `--glow-secondary`, `--surface-glass` variables that are **never defined** — dead CSS right now.

Rather than hand-editing the ~83 places across 10 files that use Tailwind's literal `bg-black`/`text-white` (and their opacity variants like `bg-black/50`, `text-white/80`), this task aliases Tailwind's core `black`/`white` colors to the `--background`/`--foreground` tokens. Since `--background`/`--foreground` are pure black/white in the dark theme (byte-identical to today), this changes zero pixels by default, but makes every existing `bg-black`, `text-white`, `border-white/10`, etc. across the whole codebase automatically theme-aware with a two-file change instead of ~83 scattered edits.

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`
- Modify: `index.html` (pin to dark via a static class until Task 5's `ThemeProvider` takes over — see Step 3.5)

**Interfaces:**
- Produces: light theme CSS variables under `:root`, dark theme preserved verbatim under `.dark`, working `--glow`/`--glow-secondary`/`--surface-glass` tokens, and a `black`/`white` Tailwind color alias — all consumed by Task 4 (elevated-surface cleanup) and Task 5 (theme toggle).

- [ ] **Step 1: Alias black/white in tailwind.config.ts**

In `tailwind.config.ts`, add two entries to `theme.extend.colors` (after the existing `card` entry, before `glow`):

```ts
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        black: "hsl(var(--background))",
        white: "hsl(var(--foreground))",
        glow: "hsl(var(--glow))",
```

- [ ] **Step 2: Replace the :root block in index.css with light values, and add the dark values under .dark**

In `src/index.css`, replace the entire first `@layer base { :root { ... } }` block (currently lines 7–48) with:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 4%;

    --card: 0 0% 98%;
    --card-foreground: 0 0% 4%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 4%;

    --primary: 141 73% 35%; /* Spotify Green, darkened for AA contrast on white */
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 94%;
    --secondary-foreground: 0 0% 20%;

    --muted: 0 0% 92%;
    --muted-foreground: 0 0% 35%;

    --accent: 0 0% 88%;
    --accent-foreground: 0 0% 4%;

    --destructive: 0 62% 45%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 88%;
    --input: 0 0% 88%;
    --ring: 141 73% 35%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 0 0% 20%;
    --sidebar-primary: 141 73% 35%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 0 0% 92%;
    --sidebar-accent-foreground: 0 0% 4%;
    --sidebar-border: 0 0% 88%;
    --sidebar-ring: 141 73% 35%;

    --glow: 141 73% 42%;
    --glow-secondary: 200 98% 45%;
    --surface-glass: 0 0% 100%;
  }

  .dark {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;

    --card: 0 0% 7%;
    --card-foreground: 0 0% 100%;

    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 100%;

    --primary: 141 73% 42%; /* Spotify Green */
    --primary-foreground: 0 0% 0%;

    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 70%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 70%;

    --accent: 0 0% 20%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 62% 30%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 141 73% 42%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 0%;
    --sidebar-foreground: 0 0% 70%;
    --sidebar-primary: 141 73% 42%;
    --sidebar-primary-foreground: 0 0% 0%;
    --sidebar-accent: 0 0% 10%;
    --sidebar-accent-foreground: 0 0% 100%;
    --sidebar-border: 0 0% 0%;
    --sidebar-ring: 141 73% 42%;

    --glow: 141 73% 55%;
    --glow-secondary: 200 98% 65%;
    --surface-glass: 0 0% 10%;
  }
}
```

- [ ] **Step 3: Make the body layer theme-aware**

In `src/index.css`, find:

```css
  body {
    @apply bg-black text-white font-sans antialiased;
  }
```

Replace with:

```css
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
```

(This is now equivalent to the old `bg-black text-white` in dark mode thanks to Step 1's alias, but is the semantically correct root-level class.)

- [ ] **Step 3.5: Pin the site to dark until Task 5 adds theme switching**

Nothing applies the `.dark` class to `<html>` yet — that's Task 5's job (`next-themes`' `ThemeProvider`). Without it, bare `:root` (now the light theme values) is what actually renders, which would flip the site to light for every commit between this task and Task 5. Pin it to dark for now.

In `index.html`, find:

```html
<html lang="en">
```

Replace with:

```html
<html lang="en" class="dark">
```

Task 5 will remove this static class once `ThemeProvider` takes over managing it dynamically (documented there).

- [ ] **Step 4: Verify no visual change in the default (dark) theme**

Run: `bun run build && bun run dev`

Open `http://localhost:8080`, confirm the site looks byte-for-byte the same as before this task (still solid black background, white text) — this proves the token refactor was non-destructive. Stop the dev server (`Ctrl+C`).

- [ ] **Step 5: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts src/index.css index.html
git commit -m "feat: add light theme tokens, fix dead glow/glass tokens, alias black/white for theme-awareness"
```

---

### Task 4: Elevated-surface color cleanup

**Context:** Task 3's alias covers `bg-black`/`text-white` and their opacity variants everywhere. It does **not** cover arbitrary hex values like `bg-[#181818]` or `bg-[#282828]` — these are "elevated surface" grays (card backgrounds, hover states) that need their own semantic tokens to respond to the theme. This task replaces those specific arbitrary values with the existing `card`/`secondary`/`accent`/`muted` tokens.

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Education.tsx`
- Modify: `src/pages/ProjectDetail.tsx`

**Interfaces:**
- Consumes: `card`, `secondary`, `accent`, `muted`, `background` Tailwind color tokens from Task 3.
- Produces: no new files/exports — a codebase with no remaining arbitrary elevated-surface hex values except the one documented exception below.

- [ ] **Step 1: Hero.tsx — avatar frame background**

In `src/components/Hero.tsx` line 11, replace:

```tsx
        <div className="w-40 h-40 md:w-64 md:h-64 rounded-full shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-black/20 overflow-hidden bg-[#282828]">
```

with:

```tsx
        <div className="w-40 h-40 md:w-64 md:h-64 rounded-full shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-black/20 overflow-hidden bg-secondary">
```

Leave line 8's `from-[#45362E] to-black` gradient untouched — it's an intentional fixed decorative brand accent, not a structural surface, and is out of scope for theme-awareness.

- [ ] **Step 2: Experience.tsx — logo box and hardcoded gray text**

In `src/components/Experience.tsx` line 121, replace:

```tsx
                       <div className="w-10 h-10 md:w-14 md:h-14 bg-[#1e1e1e] rounded-md flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-colors">
```

with:

```tsx
                       <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary rounded-md flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-colors">
```

Then replace every `text-[#B3B3B3]` in this file (lines 105, 136, 142, 146, 150, 166) with `text-subdued` — same visual value, but routes through the now-theme-aware utility class instead of a hardcoded hex. For example, line 105:

```tsx
                      <span className={cn(
                        "text-[#B3B3B3] text-[14px] md:text-[16px] font-normal group-hover:opacity-0 transition-opacity",
                        isExpanded && "opacity-0"
                      )}>
```

becomes:

```tsx
                      <span className={cn(
                        "text-subdued text-[14px] md:text-[16px] font-normal group-hover:opacity-0 transition-opacity",
                        isExpanded && "opacity-0"
                      )}>
```

Apply the same `text-[#B3B3B3]` → `text-subdued` substitution at lines 136, 142, 146, 150, and 166.

- [ ] **Step 3: Projects.tsx — card surface, gradient placeholder, button hover, tab pills**

In `src/components/Projects.tsx` line 127, replace:

```tsx
      className="bg-[#181818] hover:bg-[#282828] transition-all duration-300 rounded-lg p-3 md:p-4 group cursor-pointer w-full overflow-hidden"
```

with:

```tsx
      className="bg-card hover:bg-accent transition-all duration-300 rounded-lg p-3 md:p-4 group cursor-pointer w-full overflow-hidden"
```

Line 129, replace:

```tsx
      <div className="relative aspect-video mb-2 shadow-2xl overflow-hidden rounded-md bg-gradient-to-br from-[#333] to-[#121212] flex items-center justify-center border border-white/5">
```

with:

```tsx
      <div className="relative aspect-video mb-2 shadow-2xl overflow-hidden rounded-md bg-gradient-to-br from-muted to-background flex items-center justify-center border border-white/5">
```

Line 144, replace `hover:bg-[#1ed760]` with `hover:bg-primary/90`:

```tsx
            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-primary hover:bg-primary/90 text-black p-2 rounded-full font-bold shadow-xl transition-all transform hover:scale-110 active:scale-95 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 z-10"
```

Line 259, replace `bg-[#2a2a2a]` with `bg-secondary`:

```tsx
                className="rounded-full px-3 md:px-4 py-1 md:py-1.5 bg-secondary text-white data-[state=active]:bg-white data-[state=active]:text-black border-none text-[10px] md:text-xs"
```

- [ ] **Step 4: Education.tsx — icon box background and hover**

In `src/components/Education.tsx` line 52, replace:

```tsx
                   <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 group-hover:bg-[#333]">
```

with:

```tsx
                   <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center flex-shrink-0 group-hover:bg-accent">
```

- [ ] **Step 5: ProjectDetail.tsx — page and panel backgrounds**

In `src/pages/ProjectDetail.tsx`, replace `bg-[#191919]` with `bg-background` at both occurrences (lines 134 and 201):

Line 134:
```tsx
    <div className="h-screen flex bg-background text-white overflow-hidden">
```

Line 201:
```tsx
        <main className="flex-1 flex flex-col min-h-0 bg-background">
```

Replace `bg-[#202020]` with `bg-card` at all three occurrences (lines 139, 191, 224):

Line 139:
```tsx
        } shrink-0 transition-all duration-200 bg-card border-r border-white/5 overflow-hidden`}
```

Line 191:
```tsx
        <header className="shrink-0 flex items-center gap-3 px-4 py-2 bg-card border-b border-white/5">
```

Line 224:
```tsx
            <div className="shrink-0 border-t border-white/5 bg-card px-4 max-h-60 overflow-y-auto">
```

- [ ] **Step 6: Verify no remaining unintended hardcoded elevated-surface hex values**

Run: `grep -rn "#[0-9A-Fa-f]\{3,6\}" src/components src/pages --include="*.tsx" | grep -v "/ui/"`

Expected: only `src/components/Hero.tsx` line 8 (`from-[#45362E]`) remains — the documented intentional exception. If anything else appears, it was missed above; fix it before continuing.

- [ ] **Step 7: Verify no visual change in the default (dark) theme**

Run: `bun run build && bun run dev`

Open `http://localhost:8080`, confirm the site still looks identical to before Task 3 (all the replaced tokens resolve to the same dark values). Stop the dev server.

- [ ] **Step 8: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/Hero.tsx src/components/Experience.tsx src/components/Projects.tsx src/components/Education.tsx src/pages/ProjectDetail.tsx
git commit -m "refactor: replace hardcoded elevated-surface hex colors with semantic tokens"
```

---

### Task 5: Theme system — ThemeProvider and ThemeToggle

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/ThemeToggle.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/Index.tsx`
- Modify: `index.html` (remove the static `class="dark"` pin added in Task 3, now that `ThemeProvider` manages it — see Step 5.5)
- Modify: `src/index.css` (make `.text-subdued` theme-aware — see Step 6.5)
- Modify: `src/test/setup.ts` (add a localStorage polyfill for the test environment — see Step 0.5)

**Interfaces:**
- Consumes: light/dark CSS tokens from Task 3.
- Produces: `<ThemeToggle />` component; `next-themes`' `ThemeProvider` wrapping the app tree — consumed by Task 6 (`CommandPalette`'s theme-toggle action uses `useTheme()` directly, requiring `ThemeProvider` to already be in the tree).

- [ ] **Step 0.5: Add a localStorage polyfill to the test environment**

In this Bun 1.3.14 + Vitest + jsdom combination, the global `localStorage` resolves to a completely non-functional stub (a plain object with no `setItem`/`getItem`/`clear` — confirmed via a diagnostic test: `typeof localStorage.clear` is `undefined`, `Object.keys(localStorage)` is `[]`, and the constructor is `undefined`). This isn't jsdom's real Storage implementation and isn't caused by any code in this task — it's an environment gap, exactly like the existing `matchMedia` stub already in this file for the same class of reason. `next-themes` (used by `ThemeToggle` below) reads/writes `localStorage` for persistence, so tests exercising it need a working one.

In `src/test/setup.ts`, append after the existing `matchMedia` stub:

```ts
class MockLocalStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  get length() {
    return this.store.size;
  }
}

const mockLocalStorage = new MockLocalStorage();
Object.defineProperty(window, "localStorage", {
  writable: true,
  configurable: true,
  value: mockLocalStorage,
});
Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  configurable: true,
  value: mockLocalStorage,
});
```

Run `bun run test` and confirm `ThemeToggle.test.tsx`'s three tests (written in Step 1 below) now pass — they were failing with `localStorage.clear is not a function` before this polyfill existed.

- [ ] **Step 1: Write the failing test for ThemeToggle**

Create `src/components/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

function renderWithTheme() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("shows the 'switch to light' label by default (dark theme)", () => {
    renderWithTheme();
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
  });

  it("toggles to light theme on click and removes the dark class from <html>", async () => {
    renderWithTheme();
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(await screen.findByLabelText("Switch to dark theme")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the choice to localStorage", () => {
    renderWithTheme();
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/ThemeToggle.test.tsx`
Expected: FAIL — `Failed to resolve import "./ThemeToggle"`.

- [ ] **Step 3: Implement ThemeToggle**

Create `src/components/ThemeToggle.tsx`:

```tsx
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? "dark") === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/ThemeToggle.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Wire ThemeProvider into App.tsx**

In `src/App.tsx`, add the import (after the existing `TooltipProvider` import):

```tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
```

Then wrap the returned tree. Replace:

```tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

with:

```tsx
const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
```

- [ ] **Step 5.5: Remove the static dark-class pin from index.html**

Task 3 added `class="dark"` directly on `<html>` as a temporary pin, since nothing applied it dynamically yet. `next-themes`' `ThemeProvider` (just wired in Step 5) now manages that class at runtime — the static one is redundant and must go, or it will fight with `next-themes` when a visitor switches to light.

In `index.html`, find:

```html
<html lang="en" class="dark">
```

Replace with:

```html
<html lang="en">
```

- [ ] **Step 6: Mount ThemeToggle in the Index.tsx header**

In `src/pages/Index.tsx`, add the import (after the `lucide-react` import):

```tsx
import { FileDown, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
```

Then add the toggle to the header icon row. Find:

```tsx
                <a 
                  href="https://www.linkedin.com/in/adam-lim-4247481a5/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-subdued hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </header>
```

Replace with:

```tsx
                <a 
                  href="https://www.linkedin.com/in/adam-lim-4247481a5/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-subdued hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
                <ThemeToggle />
              </div>
            </header>
```

- [ ] **Step 6.5: Make .text-subdued theme-aware**

Caught during Task 4's review: `.text-subdued` in `src/index.css` is still a hardcoded hex with no light-mode branch, unlike every other color in the design system. Left as-is, subdued text (used across About, Education, AppSidebar, Projects, Index, and more) would stay dark-mode-gray in light mode — likely a real readability problem on the new light background, and now that the theme toggle exists in this task, it's finally possible to actually see and verify the fix.

In `src/index.css`, find:

```css
  .text-subdued {
    @apply text-[#b3b3b3];
  }
```

Replace with:

```css
  .text-subdued {
    @apply text-muted-foreground;
  }
```

`--muted-foreground` is already defined per-theme from Task 3 (`0 0% 35%` light, `0 0% 70%` dark) — in dark mode this renders effectively the same subdued gray as before (verify no visible change there), and in light mode it now resolves to a readable dark gray instead of staying stuck at the dark-mode-only `#b3b3b3`.

- [ ] **Step 7: Manually verify both themes render correctly end-to-end**

Run: `bun run dev`

Open `http://localhost:8080`. Confirm: page loads dark (identical to before this plan). Click the new theme toggle in the header — the whole page (background, headings, body text, sidebar, cards) switches to the light palette from Task 3, and the toggle icon switches from moon to sun. Specifically check subdued/muted text (section subtitles, card metadata) is legible in both themes, not the same fixed gray in both. Reload the page — it stays light (persisted). Click again to switch back to dark. Stop the dev server.

- [ ] **Step 8: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/ThemeToggle.tsx src/components/ThemeToggle.test.tsx src/App.tsx src/pages/Index.tsx index.html src/index.css src/test/setup.ts
git commit -m "feat: add dark/light theme toggle via next-themes"
```

---

### Task 6: Command palette

**Files:**
- Create: `src/components/CommandPalette.tsx`
- Create: `src/components/CommandPalette.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` context from Task 5 (`useTheme()`); existing `Command*` primitives from `src/components/ui/command.tsx`.
- Produces: `<CommandPalette />` mounted once inside `<BrowserRouter>`.

- [ ] **Step 1: Write the failing test for CommandPalette**

Create `src/components/CommandPalette.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "./CommandPalette";

function renderPalette() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <CommandPalette />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("CommandPalette", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  it("opens on Cmd+K", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(await screen.findByPlaceholderText(/jump to a section/i)).toBeInTheDocument();
  });

  it("filters items as the user types", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const input = await screen.findByPlaceholderText(/jump to a section/i);
    fireEvent.change(input, { target: { value: "Tracely" } });
    expect(await screen.findByText("Tracely")).toBeInTheDocument();
    expect(screen.queryByText("SunDog")).not.toBeInTheDocument();
  });

  it("closes the dialog after selecting an item", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const item = await screen.findByText("About");
    fireEvent.click(item);
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/jump to a section/i)).not.toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/CommandPalette.test.tsx`
Expected: FAIL — `Failed to resolve import "./CommandPalette"`.

- [ ] **Step 3: Implement CommandPalette**

Create `src/components/CommandPalette.tsx`:

```tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Briefcase,
  FileDown,
  FolderKanban,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Sun,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const SECTION_ITEMS = [
  { id: "hero", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "little-about", label: "Little about me", icon: User },
];

const PROJECT_ITEMS = [
  { slug: "ai-payment-chargeback", label: "AI-Powered Payment Platform" },
  { slug: "ai-store-finder", label: "AI-Powered Store Finder" },
  { slug: "tracely", label: "Tracely" },
  { slug: "sundog", label: "SunDog" },
];

const EXTERNAL_LINKS = [
  { label: "GitHub", url: "https://github.com/Jung028", icon: Github },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/adam-lim-4247481a5/", icon: Linkedin },
  { label: "Download Resume", url: "/resume.pdf", icon: FileDown },
  { label: "Email", url: "mailto:aedamjung@gmail.com", icon: Mail },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? "dark") === "dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const jumpToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a section, project, or action..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTION_ITEMS.map((item) => (
            <CommandItem key={item.id} onSelect={() => runCommand(() => jumpToSection(item.id))}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {PROJECT_ITEMS.map((item) => (
            <CommandItem key={item.slug} onSelect={() => runCommand(() => navigate(`/projects/${item.slug}`))}>
              <FolderKanban className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          {EXTERNAL_LINKS.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(() => window.open(item.url, "_blank", "noopener,noreferrer"))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => setTheme(isDark ? "light" : "dark"))}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/CommandPalette.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Mount CommandPalette in App.tsx**

In `src/App.tsx`, add the import:

```tsx
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "@/components/CommandPalette";
```

Mount it inside `<BrowserRouter>` (it needs router context for `useNavigate`), before `<Routes>`. Replace:

```tsx
        <BrowserRouter>
          <Routes>
```

with:

```tsx
        <BrowserRouter>
          <CommandPalette />
          <Routes>
```

- [ ] **Step 6: Manually verify in the browser**

Run: `bun run dev`

Open `http://localhost:8080`, press `Cmd+K` (or `Ctrl+K`), confirm the palette opens, type "Tracely", select it, confirm it navigates to `/projects/tracely`. Go back, press `Cmd+K` again, select "Toggle theme", confirm the site switches theme. Stop the dev server.

- [ ] **Step 7: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/CommandPalette.tsx src/components/CommandPalette.test.tsx src/App.tsx
git commit -m "feat: add Cmd+K command palette for navigation and theme toggle"
```

---

### Task 7: Custom cursor

**Files:**
- Create: `src/components/CustomCursor.tsx`
- Create: `src/components/CustomCursor.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/AppSidebar.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/LittleAboutMe.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `<CustomCursor />` mounted once in `App.tsx`; the `data-cursor-hover` attribute convention, applied to the key interactive elements below and consumed by Task 8's `GithubStatsCard`.

- [ ] **Step 1: Write the failing test for CustomCursor**

Create `src/components/CustomCursor.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { CustomCursor } from "./CustomCursor";

function mockPointer(coarse: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: coarse,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("CustomCursor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing on coarse (touch) pointers", () => {
    mockPointer(true);
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the cursor dot and ring on fine (mouse) pointers", () => {
    mockPointer(false);
    const { container } = render(<CustomCursor />);
    expect(container.querySelectorAll("div").length).toBe(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/components/CustomCursor.test.tsx`
Expected: FAIL — `Failed to resolve import "./CustomCursor"`.

- [ ] **Step 3: Implement CustomCursor**

Create `src/components/CustomCursor.tsx`:

```tsx
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const isCoarsePointer = () => window.matchMedia("(pointer: coarse)").matches;

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  useEffect(() => {
    if (isCoarsePointer()) return;
    setEnabled(true);

    const handleMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      const target = event.target as HTMLElement;
      setHovering(!!target.closest("[data-cursor-hover]"));
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-primary"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-primary"
        animate={{ width: hovering ? 48 : 28, height: hovering ? 48 : 28 }}
        transition={{ duration: 0.2 }}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/components/CustomCursor.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Mount CustomCursor in App.tsx**

In `src/App.tsx`, add the import:

```tsx
import { CommandPalette } from "@/components/CommandPalette";
import { CustomCursor } from "@/components/CustomCursor";
```

Mount it alongside `CommandPalette`. Replace:

```tsx
        <BrowserRouter>
          <CommandPalette />
          <Routes>
```

with:

```tsx
        <BrowserRouter>
          <CustomCursor />
          <CommandPalette />
          <Routes>
```

- [ ] **Step 6: Mark key interactive elements with data-cursor-hover**

In `src/components/ThemeToggle.tsx`, add `data-cursor-hover` to the button:

```tsx
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor-hover
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
    >
```

In `src/pages/Index.tsx`, add `data-cursor-hover` to the Resume, GitHub, and LinkedIn links (the three `<a>` tags in the header icon row) — for example:

```tsx
                <a 
                  href="/resume.pdf" 
                  download 
                  data-cursor-hover
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                  title="Download Resume"
                >
```

(apply the same `data-cursor-hover` addition to the GitHub and LinkedIn `<a>` tags immediately below it).

In `src/components/AppSidebar.tsx`, add `data-cursor-hover` to the `SidebarMenuButton`'s inner `<a>`:

```tsx
                    <a href={item.url} onClick={handleLinkClick} data-cursor-hover className="flex items-center gap-4">
```

In `src/components/Projects.tsx`, add `data-cursor-hover` to the `ProjectCard` root `<div>` (line 125):

```tsx
    <div
      onClick={() => onOpen(project, previewIndex)}
      data-cursor-hover
      className="bg-card hover:bg-accent transition-all duration-300 rounded-lg p-3 md:p-4 group cursor-pointer w-full overflow-hidden"
    >
```

In `src/components/LittleAboutMe.tsx`, add `data-cursor-hover` to each fact card `<div>` (line 150):

```tsx
              <div
                key={i}
                data-cursor-hover
                className="group/card flex-shrink-0 snap-start relative overflow-hidden rounded-xl w-52 md:w-64 h-72 md:h-80 cursor-pointer"
              >
```

- [ ] **Step 7: Manually verify in the browser**

Run: `bun run dev`

Open `http://localhost:8080` with a mouse (not a touchscreen/trackpad-emulated-touch device). Confirm a small dot + lagging ring follow the cursor, and the ring grows when hovering a project card, sidebar link, or the theme toggle. Stop the dev server.

- [ ] **Step 8: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/CustomCursor.tsx src/components/CustomCursor.test.tsx src/App.tsx src/components/ThemeToggle.tsx src/pages/Index.tsx src/components/AppSidebar.tsx src/components/Projects.tsx src/components/LittleAboutMe.tsx
git commit -m "feat: add custom cursor with hover states, disabled on touch devices"
```

---

### Task 8: Live GitHub stats

**Files:**
- Create: `src/hooks/useGithubStats.ts`
- Create: `src/hooks/useGithubStats.test.ts`
- Create: `src/components/GithubStatsCard.tsx`
- Create: `src/components/GithubStatsCard.test.tsx`
- Modify: `src/components/LittleAboutMe.tsx`

**Interfaces:**
- Consumes: `data-cursor-hover` convention from Task 7.
- Produces: `useGithubStats(): { status: "loading" | "success" | "error"; data: GithubStats | null }` and `<GithubStatsCard />`, mounted inside `LittleAboutMe`.

- [ ] **Step 1: Write the failing test for useGithubStats**

Create `src/hooks/useGithubStats.test.ts`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGithubStats } from "./useGithubStats";

const mockUser = { public_repos: 12, followers: 3, html_url: "https://github.com/Jung028" };
const mockRepos = [
  {
    name: "tracely",
    html_url: "https://github.com/Jung028/tracely",
    description: "Agentic incident response",
    stargazers_count: 1,
    pushed_at: "2026-01-01",
  },
];

function mockFetchSuccess() {
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
    .mockResolvedValueOnce({ ok: true, json: async () => mockRepos });
}

describe("useGithubStats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in loading state", () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useGithubStats());
    expect(result.current.status).toBe("loading");
  });

  it("transitions to success with user and repo data", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.data?.user.public_repos).toBe(12);
    expect(result.current.data?.repos[0].name).toBe("tracely");
  });

  it("transitions to error when the GitHub API responds with a non-2xx status", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.data).toBeNull();
  });

  it("transitions to error on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test src/hooks/useGithubStats.test.ts`
Expected: FAIL — `Failed to resolve import "./useGithubStats"`.

- [ ] **Step 3: Implement useGithubStats**

Create `src/hooks/useGithubStats.ts`:

```tsx
import { useEffect, useState } from "react";

export const GITHUB_USERNAME = "Jung028";

export type GithubUser = {
  public_repos: number;
  followers: number;
  html_url: string;
};

export type GithubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
};

export type GithubStats = {
  user: GithubUser;
  repos: GithubRepo[];
};

export type GithubStatsStatus = "loading" | "success" | "error";

export function useGithubStats(): { status: GithubStatsStatus; data: GithubStats | null } {
  const [status, setStatus] = useState<GithubStatsStatus>("loading");
  const [data, setData] = useState<GithubStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5`),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("GitHub API request failed");
        }

        const user = (await userRes.json()) as GithubUser;
        const repos = (await reposRes.json()) as GithubRepo[];

        if (!cancelled) {
          setData({ user, repos });
          setStatus("success");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, data };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test src/hooks/useGithubStats.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing test for GithubStatsCard**

Create `src/components/GithubStatsCard.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as githubStatsHook from "@/hooks/useGithubStats";
import { GithubStatsCard } from "./GithubStatsCard";

describe("GithubStatsCard", () => {
  it("renders live stats on success", () => {
    vi.spyOn(githubStatsHook, "useGithubStats").mockReturnValue({
      status: "success",
      data: {
        user: { public_repos: 12, followers: 3, html_url: "https://github.com/Jung028" },
        repos: [
          {
            name: "tracely",
            html_url: "https://github.com/Jung028/tracely",
            description: null,
            stargazers_count: 1,
            pushed_at: "2026-01-01",
          },
        ],
      },
    });
    render(<GithubStatsCard />);
    expect(screen.getByText(/12 repos/)).toBeInTheDocument();
    expect(screen.getByText("tracely")).toBeInTheDocument();
  });

  it("renders a static fallback on error", () => {
    vi.spyOn(githubStatsHook, "useGithubStats").mockReturnValue({ status: "error", data: null });
    render(<GithubStatsCard />);
    expect(screen.getByText("View GitHub profile")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `bun run test src/components/GithubStatsCard.test.tsx`
Expected: FAIL — `Failed to resolve import "./GithubStatsCard"`.

- [ ] **Step 7: Implement GithubStatsCard**

Create `src/components/GithubStatsCard.tsx`:

```tsx
import { GitFork, Github, Star, Users } from "lucide-react";
import { GITHUB_USERNAME, useGithubStats } from "@/hooks/useGithubStats";

export const GithubStatsCard = () => {
  const { status, data } = useGithubStats();

  if (status !== "success" || !data) {
    return (
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noreferrer"
        data-cursor-hover
        className="spotify-card mt-6 flex items-center gap-3 w-fit"
      >
        <Github size={18} className="text-white" />
        <span className="text-subdued text-sm font-medium">View GitHub profile</span>
      </a>
    );
  }

  return (
    <div className="spotify-card mt-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Github size={18} className="text-white" />
        <a
          href={data.user.html_url}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="text-white font-semibold text-sm hover:underline"
        >
          @{GITHUB_USERNAME}
        </a>
        <span className="flex items-center gap-1 text-subdued text-xs">
          <Star size={12} /> {data.user.public_repos} repos
        </span>
        <span className="flex items-center gap-1 text-subdued text-xs">
          <Users size={12} /> {data.user.followers} followers
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="flex items-center gap-1.5 text-xs bg-secondary hover:bg-accent border border-white/10 rounded-md px-3 py-2 text-subdued hover:text-white transition-colors"
          >
            <GitFork size={12} /> {repo.name}
          </a>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `bun run test src/components/GithubStatsCard.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 9: Mount GithubStatsCard in LittleAboutMe**

In `src/components/LittleAboutMe.tsx`, add the import:

```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GithubStatsCard } from "@/components/GithubStatsCard";
```

Then mount it after the scroll track's closing `</div>`, still inside the `relative group/scroll` wrapper's parent container. Find:

```tsx
          </div>
        </div>
      </div>
    </section>
  );
};

export default LittleAboutMe;
```

Replace with:

```tsx
          </div>
        </div>

        <GithubStatsCard />
      </div>
    </section>
  );
};

export default LittleAboutMe;
```

- [ ] **Step 10: Manually verify in the browser**

Run: `bun run dev`

Open `http://localhost:8080`, scroll to "Little about me", confirm a GitHub stats card appears below the photo carousel showing repo/follower counts and recent repo links (or the static fallback link if the GitHub API rate-limits you). Stop the dev server.

- [ ] **Step 11: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 12: Commit**

```bash
git add src/hooks/useGithubStats.ts src/hooks/useGithubStats.test.ts src/components/GithubStatsCard.tsx src/components/GithubStatsCard.test.tsx src/components/LittleAboutMe.tsx
git commit -m "feat: add live GitHub stats card with static fallback"
```

---

### Task 9: Scroll-driven reveal animations

**Files:**
- Modify: `src/test/setup.ts`
- Modify: `src/components/About.tsx`
- Create: `src/components/About.test.tsx`
- Modify: `src/components/Experience.tsx`
- Create: `src/components/Experience.test.tsx`
- Modify: `src/components/Projects.tsx`
- Create: `src/components/Projects.test.tsx`
- Modify: `src/components/LittleAboutMe.tsx`
- Create: `src/components/LittleAboutMe.test.tsx`

**Interfaces:**
- Consumes: `fadeInUp`, `staggerContainer` from Task 2's `src/lib/motion-variants.ts`; `useReducedMotion()` from Task 2's `src/hooks/useReducedMotion.ts`.
- Produces: no new exports — existing sections now animate on scroll into view.

- [ ] **Step 1: Add an IntersectionObserver stub to the test environment**

Motion's `whileInView` relies on `IntersectionObserver`, which jsdom doesn't implement. Add a stub so components using it don't crash in tests. In `src/test/setup.ts`, append after the existing `matchMedia` stub:

```ts
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
```

- [ ] **Step 2: Write the failing smoke test for About**

Create `src/components/About.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About", () => {
  it("renders the About Me heading and content", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "About Me" })).toBeInTheDocument();
    expect(screen.getByText(/Backend engineer/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it currently passes as plain content (baseline)**

Run: `bun run test src/components/About.test.tsx`
Expected: PASS — this confirms the baseline render works before we touch the component; the test won't change behaviorally after animation-wrapping, it's here to guard against a regression in the next step.

- [ ] **Step 4: Wrap About's content in motion.div**

In `src/components/About.tsx`, replace the whole file:

```tsx
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const About = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="py-12 md:py-24 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">About Me</h2>
        <motion.div
          className="max-w-4xl"
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="text-subdued leading-relaxed text-sm md:text-base mb-6">
            Backend engineer currently pursuing an M.S. (Hons) in Computer Science (Advanced Entry) at the University of Sydney, specializing in Data Science and AI. Experienced in chargeback automation, distributed systems, and event-driven architectures across multiple regions. Proficient in Java, Python, REST APIs, microservices, and message brokers to design and deliver scalable, high-availability systems.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-subdued leading-relaxed text-sm md:text-base">
            Proven track record in implementing automated risk workflows, anomaly detection pipelines, and cross-entity NDF projects, while managing live incident resolution and performing root-cause analysis in multi-region deployments. Skilled at collaborating with multi-national teams, producing clear technical documentation, and delivering production-grade systems that integrate seamlessly across platforms.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
```

- [ ] **Step 5: Run the test to verify it still passes**

Run: `bun run test src/components/About.test.tsx`
Expected: PASS.

- [ ] **Step 6: Write the failing smoke test for Experience, then wrap its content**

Create `src/components/Experience.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";

describe("Experience", () => {
  it("renders the Career Tracks heading and first role", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: "Career Tracks" })).toBeInTheDocument();
    expect(screen.getByText("Java Engineer")).toBeInTheDocument();
  });
});
```

Run: `bun run test src/components/Experience.test.tsx` — Expected: PASS (baseline, unchanged so far).

In `src/components/Experience.tsx`, add the import at the top:

```tsx
import { useState } from "react";
import { motion } from "motion/react";
import { Clock3, Play, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
```

Add `const reduceMotion = useReducedMotion();` at the top of the `Experience` component body, right after `const [expandedIndex, setExpandedIndex] = useState<number | null>(null);`.

Wrap the list container. Replace:

```tsx
          {/* List */}
          <div className="flex flex-col bg-black">
            {experiences.map((exp, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div key={i} className="border-b border-white/5 last:border-0">
```

with:

```tsx
          {/* List */}
          <motion.div
            className="flex flex-col bg-black"
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {experiences.map((exp, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <motion.div key={i} variants={fadeInUp} className="border-b border-white/5 last:border-0">
```

And close it — find the matching closing tags near the end of the map:

```tsx
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
```

Replace with:

```tsx
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
```

Run: `bun run test src/components/Experience.test.tsx` — Expected: PASS.

- [ ] **Step 7: Write the failing smoke test for Projects, then wrap its content**

Create `src/components/Projects.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";

describe("Projects", () => {
  it("renders the Projects heading and project cards", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Payment Platform")).toBeInTheDocument();
  });
});
```

Run: `bun run test src/components/Projects.test.tsx` — Expected: PASS (baseline).

In `src/components/Projects.tsx`, add the import at the top:

```tsx
import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github, FolderKanban, Play, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
```

Add `const reduceMotion = useReducedMotion();` at the top of the `Projects` component body (after `const [currentVideoIndex, setCurrentVideoIndex] = useState(0);`).

Wrap the project grid. Replace:

```tsx
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {projects
                  .filter((p) => cat === "all" || p.category === cat)
                  .map((project) => (
                    <ProjectCard key={project.title} project={project} onOpen={handleOpenVideo} />
                  ))}
              </div>
```

with:

```tsx
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
                initial={reduceMotion ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
              >
                {projects
                  .filter((p) => cat === "all" || p.category === cat)
                  .map((project) => (
                    <motion.div key={project.title} variants={fadeInUp}>
                      <ProjectCard project={project} onOpen={handleOpenVideo} />
                    </motion.div>
                  ))}
              </motion.div>
```

Run: `bun run test src/components/Projects.test.tsx` — Expected: PASS.

- [ ] **Step 8: Write the failing smoke test for LittleAboutMe, then wrap its content**

Create `src/components/LittleAboutMe.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LittleAboutMe from "./LittleAboutMe";

describe("LittleAboutMe", () => {
  it("renders the section heading and fact cards", () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    render(<LittleAboutMe />);
    expect(screen.getByRole("heading", { name: "Little about me" })).toBeInTheDocument();
    expect(screen.getByText("Ant International")).toBeInTheDocument();
  });
});
```

Run: `bun run test src/components/LittleAboutMe.test.tsx` — Expected: PASS (baseline; the `fetch` mock keeps `GithubStatsCard` from making a real network call during this test).

In `src/components/LittleAboutMe.tsx`, add the import:

```tsx
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GithubStatsCard } from "@/components/GithubStatsCard";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
```

Add `const reduceMotion = useReducedMotion();` inside the `LittleAboutMe` component body (after the `showRightArrow` state declaration).

Wrap the scroll track's card list. Replace:

```tsx
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-8 md:px-12"
          >
            {facts.map((fact, i) => (
              <div
                key={i}
                data-cursor-hover
                className="group/card flex-shrink-0 snap-start relative overflow-hidden rounded-xl w-52 md:w-64 h-72 md:h-80 cursor-pointer"
              >
```

with:

```tsx
          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-8 md:px-12"
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                data-cursor-hover
                className="group/card flex-shrink-0 snap-start relative overflow-hidden rounded-xl w-52 md:w-64 h-72 md:h-80 cursor-pointer"
              >
```

And close it — find:

```tsx
              </div>
            ))}
          </div>
        </div>

        <GithubStatsCard />
```

Replace with:

```tsx
              </motion.div>
            ))}
          </motion.div>
        </div>

        <GithubStatsCard />
```

Run: `bun run test src/components/LittleAboutMe.test.tsx` — Expected: PASS.

- [ ] **Step 9: Manually verify in the browser**

Run: `bun run dev`

Open `http://localhost:8080`, scroll down slowly through About, Experience, Projects, and Little about me — confirm each section's content fades/slides in as it enters the viewport rather than being visible immediately on load. In your OS accessibility settings, enable "reduce motion", reload, and confirm the same content now appears instantly with no animation. Stop the dev server.

- [ ] **Step 10: Run the full test suite and type checker**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS (all tests across the whole suite so far).

- [ ] **Step 11: Commit**

```bash
git add src/test/setup.ts src/components/About.tsx src/components/About.test.tsx src/components/Experience.tsx src/components/Experience.test.tsx src/components/Projects.tsx src/components/Projects.test.tsx src/components/LittleAboutMe.tsx src/components/LittleAboutMe.test.tsx
git commit -m "feat: add scroll-triggered reveal animations, respecting prefers-reduced-motion"
```

---

### Task 10: Dead code cleanup

**Files:**
- Delete: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing — pure removal.

- [ ] **Step 1: Confirm Navbar.tsx has no importers**

Run: `grep -rn "Navbar" src --include="*.tsx" | grep -v "src/components/Navbar.tsx"`
Expected: no output (already confirmed during planning; re-checking here as the actual verification step before deleting).

- [ ] **Step 2: Delete the file**

Run: `rm src/components/Navbar.tsx`

- [ ] **Step 3: Verify the build and full test suite still pass**

Run: `bun run build && bun run test && bunx tsc --noEmit`
Expected: PASS — proves nothing referenced the deleted file.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/Navbar.tsx
git commit -m "chore: remove unused Navbar component (superseded by AppSidebar)"
```

---

### Task 11: Fix Playwright configuration and add the interactive-portfolio e2e spec

**Context:** `playwright.config.ts` and `playwright-fixture.ts` both import from `lovable-agent-playwright-config`, a package that is **not** declared in `package.json` and isn't installed — Playwright is currently non-functional in this repo as committed. This is a pre-existing issue, but it blocks the e2e coverage promised in the design spec, so it's fixed here as part of delivering that coverage.

**Files:**
- Modify: `playwright.config.ts`
- Modify: `playwright-fixture.ts`
- Create: `e2e/interactive-portfolio.spec.ts`

**Interfaces:**
- Consumes: the command palette (Task 6), theme toggle (Task 5), and scroll reveal (Task 9) behavior being end-to-end correct.
- Produces: nothing consumed by later tasks — this is the last functional task before documentation.

- [ ] **Step 1: Replace the broken Playwright config**

Replace the entire contents of `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 2: Fix the fixture re-export**

Replace the entire contents of `playwright-fixture.ts`:

```ts
export { test, expect } from "@playwright/test";
```

- [ ] **Step 3: Install Playwright's browser binary**

Run: `bunx playwright install --with-deps chromium`
Expected: downloads Chromium for Playwright; exits 0.

- [ ] **Step 4: Write the e2e spec**

Create `e2e/interactive-portfolio.spec.ts`:

```ts
import { test, expect } from "../playwright-fixture";

test("command palette navigates, theme toggle persists, sections reveal on scroll", async ({ page }) => {
  await page.goto("/");

  // Command palette opens via Ctrl+K and navigates to a section
  await page.keyboard.press("Control+k");
  await expect(page.getByPlaceholder(/jump to a section/i)).toBeVisible();
  await page.getByText("Experience", { exact: true }).click();
  await expect(page.getByPlaceholder(/jump to a section/i)).not.toBeVisible();

  // Theme toggle switches and persists across reload
  const toggle = page.getByLabel("Switch to light theme");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  // A section reveals on scroll
  const aboutHeading = page.getByRole("heading", { name: "About Me" });
  await aboutHeading.scrollIntoViewIfNeeded();
  await expect(aboutHeading).toBeVisible();
});
```

- [ ] **Step 5: Run the e2e spec**

Run: `bunx playwright test`
Expected: PASS (1 test). If it fails on the theme toggle assertion, confirm Task 5 was applied correctly; if it fails on the command palette, confirm Task 6.

- [ ] **Step 6: Run the full unit/component test suite and type checker one more time**

Run: `bun run test && bunx tsc --noEmit`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts playwright-fixture.ts e2e/interactive-portfolio.spec.ts
git commit -m "fix: repair broken Playwright config, add interactive-portfolio e2e spec"
```

---

### Task 12: Documentation fix — rewrite README.md

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing (documentation only).
- Produces: nothing.

- [ ] **Step 1: Replace the placeholder README**

Replace the entire contents of `README.md`:

```markdown
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
```

- [ ] **Step 2: Verify the site still builds**

Run: `bun run build`
Expected: exits 0 (README changes don't affect the build, but this confirms nothing else was accidentally left broken at the end of the plan).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: replace placeholder README with real project documentation"
```

---

## Post-plan verification

After all 12 tasks are committed, run the full verification suite one final time from a clean state to confirm nothing regressed across the whole plan:

```bash
bun install
bun run build
bun run test
bunx tsc --noEmit
bunx playwright test
```

All five commands should exit 0.
