# BookXchange

BookXchange is a reader-first book exchange app designed to help people discover books they want, share books they no longer need, and connect with other readers nearby. The project began as a front-end concept and is being evolved into a real product with a Supabase-powered backend, real user accounts, persistent book data, and a more complete reading community experience.

This README is intentionally written for the long-term direction of the project. It will continue to be updated as features, architecture, and product decisions evolve.

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

The project is currently in its prototype stage and includes:

- a landing page
- a discovery page
- a shelf management page
- a profile page
- a wishlist page
- a near-you page
- a basic JavaScript-driven demo flow

At this stage, the app is a design and interaction prototype. It does not yet use a real database or authentication flow. The next phase is to connect it to Supabase and gradually replace the static mock data with live data.

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
- search by title, author, or keywords
- filter by condition, genre, or location
- view nearby readers and their available books
- match wanted books with available books

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

The project is currently built with:

- HTML
- CSS
- JavaScript
- static front-end layout

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
├── README.md
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
- `index.html` — landing page and product introduction
- `discover.html` — browse books and find new reads
- `near-you.html` — discover readers nearby
- `shelf.html` — manage books available for exchange
- `profile.html` — personal reader profile
- `wishlist.html` — track books users want to find
- `css/style.css` — core visual design and responsive layout
- `js/app.js` — prototype interactivity for shelf actions and sample data

## How the app works today

The current front-end uses sample book data stored in JavaScript. Some of the interactions already in place include:

- rendering a list of books on the shelf
- adding a book using a modal form
- selecting a condition and description
- adding an image file from the local machine
- deleting a book from the shelf

This is useful as a working prototype, but it is not yet connected to a real backend.

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
