# AGENTS.md — Planossauro Frontend

> Instructions for AI agents (and human contributors) working in this repository.

## 1. Project Purpose

**Planossauro** (`planossauro-frontend`) is an AI-powered lesson-planning platform for teachers (Brazilian early childhood / elementary focus).

Tagline: *“Seu gerador de planejamento de aulas alavancado por IA”* (`index.html:8`).

Core flow:
1. Teacher authenticates via GitHub / Google / Facebook OAuth.
2. Chooses **Daily (`Diario`)** or **Weekly (`Semanal`)** planning mode in `src/views/contents/DesignContent.vue:1`.
3. Fills activities per day/period with configurable class time (`ClassTimeConfigPopup`).
4. Provides additional info (school, class, date range via `@vuepic/vue-datepicker`).
5. Selects a `.docx` template (`planejamento{Diario|Semanal}{1..7}.docx` + `.pdf` preview).
6. App calls LLM (local Ollama via `VITE_API_URL`/`VITE_LLM_MODEL` or `POST /planning/create` on backend) with prompt from `src/helpers/prompt.ts:1` + sanitized `qsn.json` context, parses response via `src/helpers/createPlanningHelper.ts:1`, renders doc with `docxtemplater` + `pizzip`, saves with `file-saver` and `POST /planning`.
7. Subscription quotas checked via `GET /subscription/dashboard/:uuid` and patched after generation.
8. Features beyond editor: dashboard, planning list/edit/remove, profile, support/steps, doc preview, subscription/pay via Stripe, i18n, dark/light mode, onboarding tutorial (`driver.js`).

## 2. Language

- **Code, comments, interfaces, commit messages, PRs:** English only.
- **UI / i18n:** `pt-BR` is primary, `en-US` secondary. Locales in `src/i18n/locales/{pt-BR,en-US}/**/*.json`. Add keys to both locales when adding UI text. Default locale `pt-BR`.
- **User-facing docs (README):** English with Portuguese product terms preserved (`Diario`/`Semanal`).

## 3. Technologies

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Vue 3.5** + Composition API `<script setup>` | `src/main.ts:1`, `src/App.vue:1` |
| Language | **TypeScript 5.8** `strict:true` | `tsconfig.app.json:5`, `tsconfig.json:1` |
| Build | **Vite 7.1** + `@vitejs/plugin-vue`, `vite-plugin-vue-devtools`, `@intlify/unplugin-vue-i18n` | `vite.config.ts:7`, `assetsInclude: docx` |
| Router | **Vue Router 4.5** | `src/routes.ts:1` |
| State | **Provide/Inject** contexts (no Pinia/Vuex) | `src/interfaces/context/*.interface.ts`, `App.vue` providers |
| i18n | **vue-i18n 11** | `src/i18n/index.ts:1` |
| HTTP | **axios 1.x** (`src/api/api.ts:1`) | BaseURL from `VITE_BACKEND_URI` / `VITE_API_URL` |
| Date | **@vuepic/vue-datepicker 12** | Weekly picker, range |
| Icons | **primeicons 7** + `primeicons` CSS | `pi-*` classes |
| Utils | **@vueuse/core**, **lodash-es**, **driver.js** (tutorial) |  |
| Docs | **docxtemplater 3.x + pizzip 3.x + file-saver 2.x** + **@hiseb/confetti** | `DesignContent.vue` generation |
| Styling | **SCSS** (`sass 1.x`), global `src/styles/global.scss:1`, per-view `src/styles/**` | Scoped `<style lang="scss">` |
| Lint | **ESLint 9 + typescript-eslint + eslint-plugin-vue**, `eslint.config.ts:1` (`no-console: warn`, `vue/multi-word-component-names: off`) | `npm run lint` |
| Git hooks | **husky 9** | `package.json:10`, `.husky/` |
| Node | **24.14.0** | `.nvmrc:1` |
| Runtime | SPA, `index.html:46` mounts `#app`, loads Facebook SDK + Stripe `buy-button.js` |  |
| Infra | **Docker** (`Dockerfile`, `dev.Dockerfile`, `docker-compose.yml`, `nginx.conf`) | |

Environment (see `.env.example:1`): `VITE_API_URL`, `VITE_LLM_MODEL`, `VITE_BACKEND_URI`, `VITE_GITHUB_OAUTH_URL`, `VITE_GITHUB_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID`, `VITE_FACEBOOK_APP_ID`, `VITE_STRIPE_*`, `VITE_MAILTRAP_API_TOKEN`, `VITE_APP_MODE=local|prod`, `VITE_APP_URL`.

## 4. Project Structure

```
src/
  api/            # axios instance (api.ts), healthCheck, user.api, facebook
  assets/         # qsn.json, qsn_en_US.json, planejamentos *.docx/*.pdf, screenshots
  components/     # Navbar, NavbarMobile, DailyPlan, WeeklyPlan, ClassTimeConfigPopup, PreviewDocs, Popup, Loading, TutorFloat, etc. (one folder per component)
  helpers/        # prompt.ts, sanitizeInput.ts, dayConverter.ts, monthConverter.ts, token.ts, createPlanningHelper.ts, isWeekend.ts, dateIsoConvertToBR.ts
  i18n/           # index.ts + locales/pt-BR|en-US/**/*.json
  interfaces/     # api/*, context/*, planning.interface.ts, dashboard.interface.ts, etc.
  routes.ts       # createRouter + IRoutes
  styles/         # global.scss + contents/*.style.scss
  views/
    contents/     # DesignContent.vue (orchestrator) + HomeContent, PlanningListContent, EditPlanningContent, etc.
    callbacks/    # Github/Google/Facebook/Payment/Delete callbacks
    errors/       # NotFound, Unauthorized, BackendOffline
    AppPage.vue, LandingPage.vue, LoginPage.vue, DocsPage.vue, LearnPage.vue, FinishRegister.vue
  App.vue         # root + context providers
  main.ts         # createApp + i18n + router
```

Path convention: **relative imports** (`../../components/...`). No alias.

## 5. Setup & Commands

```bash
nvm use              # 24.14.0
npm install
npm run dev          # vite 0.0.0.0:5173
npm run build        # vue-tsc -b && vite build  (typecheck is mandatory)
npm run preview      # vite preview
npm run lint         # eslint .
npm run lint:fix     # eslint --fix .
# Docker
docker build -f dev.Dockerfile -t planossauro-dev . && docker run -p 5173:5173 -v $(pwd):/app planossauro-dev
docker build -t planossauro . && docker run -p 8080:8080 planossauro
```

Before opening a PR, `npm run lint && npm run build` must pass (strict TS, `noUnusedLocals/Parameters`).

## 6. Code Style & Conventions

- Vue SFCs: `<script setup lang="ts">` + `<template>` + `<style scoped lang="scss">`. Extract styles to `src/styles/contents/*.style.scss` and import via `<style src="...">` when shared.
- TypeScript strict; define interfaces in `src/interfaces/**` and reuse. Avoid `any`.
- Props: define with `defineProps<{...}>()` and explicit types; handlers passed as `onX` props (see `DesignContent.vue:984`).
- Provide/Inject for cross-cutting state: `planningType`, `isLoading`, `popup`, `showPreview`, `templateChoose`, `hamburgueMenuToggle` — injected with `inject("key") as I*Context`.
- i18n: use `const { t, locale } = useI18n()` and `t("namespace.key")`; never hardcode UI strings.
- Dark mode: `useDark({ attribute: "data-theme", valueLight:"light", valueDark:"dark"})` from `@vueuse/core`.
- HTTP: use `backendApi` from `src/api/api.ts` (axios instance) for backend; direct `axios.post(import.meta.env.VITE_API_URL)` only for `VITE_APP_MODE==="local"` LLM path.
- Doc generation: keep `PizZip` → `Docxtemplater({ paragraphLoop:true, linebreaks:true })` → `doc.render(data)` → `saveAs` + `doc.toBase64()` pattern intact.
- SCSS: use CSS variables (`--dp-*`), mobile-first breakpoints at `920px`, `825px`, `660px`, `630px`, `355px` (see `designcontent.style.scss`).
- Naming: `PascalCase` for components/files in `components/`, `camelCase` for helpers/composables, `kebab-case` for SCSS.
- Assets: `.docx` templates must stay in `src/assets/` and be referenced via `new URL(..., import.meta.url).href` for Vite handling.

## 7. AI Agent Instructions

1. **Read before edit:** `Read` target files + related interfaces/helpers/styles before changing. Verify assumptions with `Grep`/`Glob`, not guessing.
2. **Edit, don't create:** prefer `Edit` on existing files; `Write` only for new components when splitting or adding a feature.
3. **Keep scope tight:** when asked to split/refactor (e.g., `DesignContent.vue` → `DailyPlan`/`WeeklyPlan`), keep business logic in orchestrator, make children presentational via props/callbacks. Match existing handler signatures.
4. **Type & lint:** after edits run `npm run lint` and `npm run build` (or `vue-tsc -b --noEmit`) when feasible. Fix `vue-tsc` errors before finishing.
5. **No secrets:** never commit `.env` values, tokens, or `sessionStorage` user dumps. Use `.env.example` as reference.
6. **i18n & a11y:** when touching UI, update both `pt-BR` and `en-US` locale files and keep `aria`/`title` attrs.
7. **Commit discipline:** follow Conventional Commits (see §8). One logical change per commit.
8. **Verification:** exercise code paths manually where possible (search call sites, run dev server if needed). State what you verified.
9. **Communication:** be terse/caveman per global `~/.config/opencode/AGENTS.md` for casual replies, but write **normal** code/comments/commits and use full clarity for security or irreversible actions.
10. **Do not** change build tooling, Node version, or router unless explicitly requested.

## 8. Commit Standard — Conventional Commits v1.0.0

Spec: https://www.conventionalcommits.org/en/v1.0.0/

### Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

- `type`: required. One of below.
- `scope`: optional noun in parentheses, e.g., `design`, `auth`, `i18n`, `api`, `docs`, `build`. Use lowercase, no spaces (`fix(auth): ...`, `feat(design): ...`).
- `!`: optional, appended to `type/scope` to mark **BREAKING CHANGE** (`feat!:` or `feat(api)!:`).
- `description`: imperative, lowercase, no period, ≤72 chars, in English. E.g., `add weekly plan reordering`.
- `body`: wrap at 100 chars, explain *what* and *why* vs *how*.
- `footer`: `BREAKING CHANGE: <desc>` and/or `Refs: #123`, `Closes #123`.

### Types

| Type | Use |
|------|-----|
| `feat` | New feature (minor bump) |
| `fix` | Bug fix (patch) |
| `docs` | Docs only |
| `style` | Formatting, semicolons, SCSS — no logic |
| `refactor` | Code change that neither fixes bug nor adds feature |
| `perf` | Performance improvement |
| `test` | Adding/correcting tests |
| `build` | Build system, deps, Vite, Docker, nginx |
| `ci` | CI config, Husky, GitHub Actions |
| `chore` | Maintenance, tooling, env example |
| `revert` | `revert: feat(x): ...` + `Refs: <hash>` |

### Examples

```
feat(design): split DesignContent into DailyPlan and WeeklyPlan
fix(auth): handle missing uuid in sessionStorage fallback
docs(readme): add Stripe env vars to setup guide
refactor(api): centralize planning response parsing with fallback
feat(i18n)!: rename design namespace keys (BREAKING CHANGE: update locales)

BREAKING CHANGE: `design.monday` renamed to `design.weekday.monday`
```

```
fix(planning): prevent empty activity submission in weekly mode

Validate hasEmptyStringsInClasses() before opening template chooser
and show warning popup. Avoids LLM prompt with empty arrays.

Closes #42
```

### Rules for this repo

- One commit per logical change; stage only intended files (`git status`/`git diff` before commit).
- Subject ≤50 chars ideally, ≤72 hard limit. Body only when “why” isn’t obvious.
- Never use `git commit --no-verify` without request; fix hook/lint failures instead.
- Reference Conventional Commits link in PR description when introducing new scopes.

## 9. Useful References

- Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
- Vue 3 + TS: https://vuejs.org/guide/typescript/composition-api.html
- Vite: https://vite.dev/config/
- Vue i18n: https://vue-i18n.intlify.dev/
- docxtemplater: https://docxtemplater.com/docs/
