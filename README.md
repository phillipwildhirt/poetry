# Poetry

A modern Angular application for discovering and reading poetry, powered by the [PoetryDB](https://poetrydb.org) public API.

Search poems by title, author, or line — then read the full poem on a dedicated page.

---

## Tech Stack

| | |
|---|---|
| Framework | [Angular 21](https://angular.dev) |
| UI Components | [ng-bootstrap](https://ng-bootstrap.github.io) + [Bootstrap 5](https://getbootstrap.com) |
| Testing | [Vitest](https://vitest.dev) |
| Linting | ESLint (angular-eslint + typescript-eslint) + Stylelint |
| API | [PoetryDB](https://poetrydb.org) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app hot-reloads on file changes.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the local dev server |
| `npm run build` | Production build (output: `dist/`) |
| `npm test` | Run unit tests with Vitest |
| `npm run lint` | Run ESLint + Stylelint |

---

## App Structure

```
src/app/
├── search/          # Search page — typeahead by title, author, or line
│   ├── results/     # Result sub-views (author / title / line)
│   └── search-bar/  # Typeahead search bar component
├── poem/            # Full poem view page
└── shared/          # Shared components, services, utilities
    ├── button-icon/ # Icon button component
    ├── services/    # PoetryApiService, SearchTermService, DarkModeService, BreakpointService
    ├── directives/
    ├── animations/
    └── enums/
```

### Routes

| Path | Component |
|---|---|
| `/search` | Search page |
| `/search/results` | General search results |
| `/search/author` | Author-specific results |
| `/search/title` | Title-specific results |
| `/search/line` | Line-specific results |
| `/poem/:author/:title` | Full poem view |
| `/**` | Redirects to `/search` |

---

## CI/CD

The project uses GitHub Actions with two branch strategies:

- **`master`** — runs lint and tests on every push/PR
- **`production`** — runs lint, tests, build, and deploy on every push/PR

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for the full pipeline definition.

---

## API

Data is fetched from [PoetryDB](https://poetrydb.org) (`https://poetrydb.org`). No API key required.

| Method | Endpoint | Description |
|---|---|---|
| `getAuthors()` | `/author` | Fetch all authors |
| `searchTitles(term)` | `/title,poemcount/{term}` | Search poems by title |
| `getAuthorTitles(author)` | `/author,poemcount/{author}` | Get all titles by an author |
| `searchLines(term)` | `/lines,poemcount/{term}` | Search poems by line content |
| `getPoem(author, title)` | `/author,title/{author};{title}` | Fetch a single full poem |
