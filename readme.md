# BookXchange

BookXchange is a reader-first book exchange prototype designed to help people discover books, share books they no longer need, and connect with nearby readers. It is currently a static multi-page front end with JavaScript-driven interactions and browser-local persistence.

The project is being evolved toward a Supabase-powered product with real user accounts, shared book data, and a complete exchange workflow.

## Product vision

BookXchange is meant to become a platform where readers can:

- build a personal bookshelf
- add books they want to exchange
- track books they are looking for
- discover nearby readers with overlapping interests
- request exchanges or matches
- create a more community-driven reading culture

The goal is not just to list books, but to make reading more social, practical, and community-based.

## Current status

The project is a functional front-end prototype. It currently includes:

- a landing page with recently available books and product overview
- a discovery page with title/author search and category filters
- clickable book cards with detail dialogs and exchange-request dialogs
- a shelf page for adding, editing, deleting, keeping, and re-listing books
- optional cover-image uploads stored as browser data URLs
- available-book and kept-book counts with empty states
- a near-you page with seeded readers and clickable reader-profile dialogs
- a profile page with reader details, genres, current reading, shelf, and history
- a wishlist page with sample wanted books
- a matches page with sample potential exchanges

There is no authentication, shared database, or server-side request handling yet. Shelf data is saved only in the current browser through `localStorage`, using the `bookxchangeBooks` key. Nearby readers, matches, profile content, and wishlist content are currently static or seeded demo data.

## Core functionality we want to build

### Reader experience
- sign up and log in
- create and edit a profile
- share a short bio and reader preferences
- set a location or neighborhood
- add favorite genres and reading interests

### Shelf management
- add books to a personal shelf
- mark books as available, reserved, or kept
- upload a cover image
- edit or remove listings
- track condition and notes

### Discovery and matching
- browse books from other readers
- search by title or author
- filter by category
- view book details, condition, description, and cover image
- view nearby readers and their available books
- show sample potential exchanges

### Wishlist
- save books a user wants to read
- track why a book matters to them
- see whether a matching title is available

### Exchange flow
- send a request to borrow or exchange a book
- communicate with another reader
- confirm exchange details and location
- maintain a history of past exchanges

## Tech stack

The current prototype is built with:

- HTML
- CSS
- vanilla JavaScript
- browser `localStorage` for shelf persistence
- browser `FileReader` for local cover-image previews

The planned full-stack stack is:

- Supabase for authentication, database, and storage
- PostgreSQL via Supabase
- JavaScript for front-end logic
- optional future framework such as React or Next.js

## Planned architecture

The app will evolve into a data-driven product with the following structure:

```text
rizz/
├── index.html
├── discover.html
├── matches.html
├── near-you.html
├── shelf.html
├── profile.html
├── wishlist.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   └── images/
├── supabase/
│   ├── client.js
│   ├── auth.js
│   └── db.js
├── readme.md
└── .env.example
```

This structure may change over time as the project grows. The purpose of this README is to keep the app direction clear while the project evolves.

## Data model

The product will eventually use real tables for users, books, and interactions. The initial data model will likely include:

### Users
- id
- full_name
- email
- avatar_url
- bio
- location
- favorite_genres
- created_at

### Books
- id
- title
- author
- description
- condition
- status
- isbn (optional)
- owner_id
- image_url
- created_at

### Wishlists
- id
- user_id
- title
- author
- notes
- created_at

### Exchange requests
- id
- requester_id
- owner_id
- book_id
- status
- message
- created_at

### Messages
- id
- sender_id
- receiver_id
- request_id
- content
- created_at

## Product goals

The long-term aim is to make BookXchange a useful everyday app for readers by focusing on:

- trust and transparency
- real exchange interactions
- local community discovery
- a clean and warm reading experience
- practical functionality over gimmicks

## Current project structure

```text
rizz/
├── index.html
├── discover.html
├── matches.html
├── near-you.html
├── shelf.html
├── profile.html
├── wishlist.html
├── readme.md
├── css/
│   └── style.css
└── js/
    └── app.js
```

### Purpose of the files
- `index.html` — landing page, recently available books, and product introduction
- `discover.html` — browse, search, filter, and inspect available books
- `matches.html` — display sample potential exchanges
- `near-you.html` — discover nearby readers and inspect their shelves
- `shelf.html` — add and manage books available for exchange or kept in the library
- `profile.html` — sample reader profile and exchange history
- `wishlist.html` — sample list of books the reader wants
- `css/style.css` — visual design, page layout, dialogs, and responsive styles
- `js/app.js` — shared rendering, shelf persistence, discovery filters, dialogs, and demo data

## How the app works today

The shared script starts with three sample books and four sample nearby readers. Shelf records have this shape:

```js
{
    id,
    title,
    author,
    condition,
    category,
    description,
    image,
    status,
    ownerId
}
```

Available books are rendered on the shelf and discovery pages. A book can be marked as `available` or `keeping`; only available books appear in discovery. Adding or editing a book updates the shelf, library, and discovery views and saves the result to `localStorage`.

Discovery supports the categories Fiction, Non-fiction, Classics, and Poetry. Selecting a book opens its details, and the request form currently validates the message, logs the request in the browser console, and displays a confirmation alert; it does not send or persist a real request.

The near-you page uses seeded reader records. Selecting a reader opens a profile dialog and displays up to three currently available books. This data is intentionally temporary and will later come from user and book records in Supabase.

## Supabase integration plan

The app will eventually use Supabase for:

- authentication with email/password or social logins
- database tables for users, books, and wishlist items
- storage for uploaded book images
- real-time updates when a book or match changes
- row-level security for user-owned data

### Suggested Supabase setup

- `profiles` table
- `books` table
- `wishlists` table
- `exchange_requests` table
- `messages` table
- storage bucket for `book-covers`

## Local setup for the prototype

Because the project is currently static, it can be opened locally in a browser or served with a simple local server.

### Option 1: Python

```bash
cd c:\xampp\htdocs\rizz
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### Option 2: XAMPP

If you are running the project from XAMPP, place the folder in:

```text
c:\xampp\htdocs\rizz
```

Then open:

```text
http://localhost/rizz/
```

## Future roadmap

### Phase 1: prototype cleanup
- refine the UX and visual design
- improve responsive layout on mobile
- clean up page consistency and navigation
- keep product terminology consistent across pages

### Phase 2: Supabase auth and profiles
- create accounts
- log in and log out
- store profiles and preferences
- secure user-owned data

### Phase 3: real library management
- add books to a database
- upload cover images to Supabase storage
- edit and delete shelf listings
- show books by user-specific ownership

### Phase 4: discovery and matching
- search and filter by title, author, and genre
- show other readers nearby
- support wishlist matching and recommendation logic

### Phase 5: exchange flow
- request swaps
- approve or reject requests
- message users
- track history and status

### Phase 6: growth and retention
- notifications
- book clubs or reading lists
- saved matches
- ratings and trust signals
- community recommendations

## Design principles

The app should remain:

- warm and welcoming
- reader-focused rather than commerce-heavy
- community-driven
- simple enough to use quickly
- visually elegant without feeling too gimmicky

## Important notes

This project is intentionally being built in stages. The current design is a foundation, not the final product. The README will continue to evolve as the app becomes more real and production-ready.

## License

No license has been assigned yet. This project is currently in active development and should be treated as a working prototype until a formal license and project structure are established.

## Summary

BookXchange is a book-sharing and reading-community project with a clear long-term goal: to help readers exchange books in a way that feels practical, social, and useful. The app is currently in a clean prototype phase, and the next step is to connect it to Supabase and turn static pages into a real, persistent reader experience.

This README will be updated regularly as the product grows.
