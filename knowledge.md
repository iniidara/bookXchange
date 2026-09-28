# BookXchange — Project Knowledge

## What this is
BookXchange is a **static multi-page front-end prototype** for a community book-exchange app. Readers build a shelf, wishlist books, discover nearby readers, and request exchanges. There is **no backend, auth, or build tooling yet** — all persistence is browser `localStorage`.

- 7 plain HTML pages, one shared CSS file, one shared JS file (vanilla JS, no framework, no dependencies).
- Roadmap: migrate to Supabase (auth, Postgres tables, storage for book covers, RLS). See `readme.md` for the full product vision and phased plan.

## File map
| File | Purpose |
|---|---|
| `index.html` | Landing page: hero, recently available books, how-it-works |
| `discover.html` | Browse/search/filter available books (title, author, category) |
| `shelf.html` | Add / edit / delete / keep / re-list own books |
| `near-you.html` | Seeded nearby readers + reader profile dialogs |
| `profile.html` | Sample reader profile, genres, history |
| `wishlist.html` | Sample wanted books |
| `matches.html` | Sample potential exchanges |
| `css/style.css` | All styling: layout, cards, dialogs/modals, responsive |
| `js/app.js` | **Everything**: demo data, rendering, shelf persistence, filters, dialogs (~1500+ lines, single file) |

## Commands
No package manager, build step, tests, or linter exists. Run it as a static site:

```bash
# Option 1: Python
python -m http.server 8000        # then open http://localhost:8000/

# Option 2: XAMPP (project lives at c:\xampp\htdocs\rizz)
# open http://localhost/rizz/
```

Opening `index.html` directly in a browser also works (localStorage is per-origin, so http://localhost vs file:// see different data).

## How data works (gotchas)
- **localStorage key:** `bookxchangeBooks` — the only persisted state (user's shelf). Clearing it resets to 3 demo books.
- **Book record shape:** `{ id, title, author, condition, category, description, image, status, ownerId }`.
- **Statuses:** `available` or `keeping`. Only `available` books appear in Discover and other pages' grids.
- **Cover images:** uploaded via `FileReader`, stored as **data URLs in localStorage** (can bloat the 5MB quota).
- **Demo data lives in `js/app.js`:** `defaultBooks` (3 books) and `defaultReaders` (4 readers) seed everything; near-you/profile/wishlist/matches are static demo content.
- **Categories are fixed:** Fiction, Non-fiction, Classics, Poetry.
- **Exchange requests are fake:** validated, logged to console, alert shown — nothing is sent or stored.
- DOM element lookups and page-specific logic all live in `js/app.js` guarded by element existence — element IDs in HTML are load-bearing; renaming one breaks the script silently.

## Conventions
- Plain HTML/CSS/JS only — no frameworks, bundlers, or npm packages. Don't introduce them without asking.
- Shared class vocabulary across pages: `site-header`, `site-nav`, `book-card`, `book-grid`, `button primary/secondary`, `eyebrow`, `section`, `section-heading`.
- Each page includes `css/style.css` and ends with `<script src="js/app.js">`.
- Keep product terminology consistent across pages ("shelf", "available for exchange", etc.).
- Design intent: warm, reader-focused, community-driven, not commerce-heavy.

## Known limitations (intentional, stage 1)
- No auth — one implicit user; `ownerId` exists in the data model for the future.
- No server; all pages share one JS file which will likely need splitting when Supabase lands.
- Planned Supabase tables: `profiles`, `books`, `wishlists`, `exchange_requests`, `messages` + `book-covers` storage bucket.
