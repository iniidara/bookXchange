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
- **localStorage keys:** `bookxchangeBooks` (user's shelf), `bookxchangeProfile` (name/location/bio), `bookxchangeWishlist`, `bookxchangeRequests` (exchange requests). Clearing `bookxchangeBooks` resets to 3 demo books.
- **Book record shape:** `{ id, title, author, condition, category, description, image, status, ownerId }`.
- **Statuses:** `available` or `keeping`. Only `available` books appear in Discover and other pages' grids.
- **Cover images:** uploaded via `FileReader`, stored as **data URLs in localStorage** (can bloat the 5MB quota).
- **Other-reader demo data lives in `js/app.js` `demoReaders`:** David (101) + Amara (102) with embedded `availableBooks` (defaultBooks shape) and `wishlist`; one shared dataset feeds Near You, reader profiles, matches, and the matching algorithm (`findMatches`).
- **Categories are fixed:** Fiction, Non-fiction, Classics, Poetry.
- **Exchange requests are persisted:** key `bookxchangeRequests`, records `{ id, requesterId, recipientId, bookId, message, status: "pending"|"accepted"|"declined", createdAt, updatedAt? }`. Reusable functions in `app.js`: `createExchangeRequest`, `loadExchangeRequests`, `saveExchangeRequests`, `setExchangeRequestStatus` (validates against `EXCHANGE_REQUEST_STATUSES`, stamps `updatedAt`), `findExchangeRequestById`. Demo ids: requester = 1 (implicit local user, no auth); recipient = the book owner's demo-reader id, or 1 when the book is the demo user's own. No chat yet.
- **Requests are displayed on profile.html** in an "Exchange requests" section (`#exchange-requests-list`, `displayExchangeRequests()`), reusing the wishlist row classes. Shows book (resolved from user shelf + demoReaders via `findBookInfoById`), other reader (`getOtherParticipant`: To/From + name), message, and capitalized status. `loadExchangeRequests` falls back to 3 seeded demo requests (ids 9001–9003) when the key is absent/corrupt; explicit `[]` shows the empty state. Read-only display — status changes go through `setExchangeRequestStatus`.
- **Locations match by word token** (`isLocationNearby`): normalized, split on non-alphanumerics, share any token → "nearby". Supabase will replace with real coordinates.
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
