# ARCHITECTURE.md — Little Fox Affiliate Book Recommendation Website

> Scope rule: this document contains only what is in the project brief. Anything the brief did not specify is listed under **Open Inputs** and left as a placeholder. Nothing else is assumed.

---

## 1. Project Summary

A full-stack affiliate book recommendation website, inspired by the layout of a digital bookstore landing page (hero banner, horizontal book rows, "Featured on" strip, footer).

**Critical rule:** there is **NO cart and NO checkout**. Every "buy" action sends the visitor to the owner's Amazon affiliate link (`affiliateUrl`). Only the owner's books and links appear anywhere on the site.

## 2. Tech Stack (as specified)

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS, React Router |
| Backend | Node.js + Express, REST API (JSON) |
| Database | `books.json` (simple, easy to edit later) |
| Client ↔ Server | REST APIs only, via fetch/axios |
| Config | `.env` for API URL and port; CORS enabled on backend |
| Responsiveness | Fully responsive, mobile-first, works well on phones |

## 3. Brand

| Item | Value |
|---|---|
| Site / logo name | **Little Fox** |
| Logo | **The supplied image** (red fox-head badge with the "Little Fox" wordmark). It is used as-is in the header and footer. This replaces the brief's "create a text-based SVG" instruction, per the later instruction to use the given image as the logo. |
| Primary / accent / background colors | `[primary]`, `[accent]`, `[background]` — **not provided** |
| Style | `[e.g. friendly, clean, modern]` — **not provided** |
| Site language | `[English / Tamil / both]` — **not provided** |

## 4. Folder Structure

```
little-fox-books/
├── README.md
├── ARCHITECTURE.md
│
├── server/
│   ├── package.json
│   ├── .env                      # PORT
│   ├── .env.example
│   ├── server.js                 # Express app entry, CORS, routes
│   ├── data/
│   │   ├── books.json            # 6 placeholder books (edit to add books)
│   │   └── settings.json         # logo name, Amazon URL, Pinterest URL
│   ├── routes/
│   │   ├── books.routes.js       # /api/books, /:id, /:id/related
│   │   └── settings.routes.js    # /api/settings
│   └── controllers/
│       ├── books.controller.js
│       └── settings.controller.js
│
└── client/
    ├── package.json
    ├── .env                      # VITE_API_URL
    ├── .env.example
    ├── index.html                # default title + meta description
    ├── vite.config.js
    ├── tailwind.config.js        # brand color tokens, dark mode
    ├── postcss.config.js
    ├── public/
    │   ├── logo/
    │   │   └── little-fox-logo.jpeg   # the supplied logo image
    │   └── covers/                    # placeholder cover images (replace later)
    └── src/
        ├── main.jsx
        ├── App.jsx               # React Router routes
        ├── index.css             # Tailwind, smooth scrolling, focus styles
        ├── api/
        │   └── client.js         # fetch/axios wrapper using VITE_API_URL
        ├── components/
        │   ├── Header.jsx        # logo + nav (Home, Books, Contact); no cart icon
        │   ├── Footer.jsx
        │   ├── Hero.jsx          # headline, subtext, cover collage, button
        │   ├── FindMeOn.jsx      # Amazon + Pinterest logos/links
        │   ├── BookCard.jsx
        │   ├── BookGrid.jsx
        │   ├── QuantitySelector.jsx
        │   ├── BuyButton.jsx     # opens affiliateUrl, rel="noopener sponsored"
        │   ├── CoverImage.jsx    # lazy-load, alt text, brand-color placeholder
        │   ├── ThemeToggle.jsx   # light / dark mode
        │   └── Seo.jsx           # title, meta description, Open Graph
        └── pages/
            ├── Home.jsx          # Page 1
            └── BookDetail.jsx    # Page 2  (/book/:id)
```

## 5. REST API Contract

| Method & Path | Returns |
|---|---|
| `GET /api/books` | list of all books |
| `GET /api/books/:id` | one book |
| `GET /api/books/:id/related` | all other books (everything except `:id`) |
| `GET /api/settings` | logo name, Amazon profile URL, Pinterest profile URL |

**Book object**

| Field | Notes |
|---|---|
| `id` | |
| `title` | |
| `author` | |
| `coverImage` | falls back to brand-color placeholder if missing |
| `shortDescription` | |
| `fullDescription` | shown on the detail page |
| `price` | optional |
| `affiliateUrl` | owner's Amazon affiliate link |
| `category` | |

## 6. Routes (Frontend)

| Path | Page |
|---|---|
| `/` | Page 1: Home |
| `/book/:id` | Page 2: Book Detail |

## 7. Phase-by-Phase Steps

### Phase 1 — Project setup
1. Create the root folder with `client/` and `server/`.
2. Initialise `server/` (Node.js + Express) and `client/` (Vite + React).
3. Install Tailwind CSS and React Router in `client/`.
4. Create `.env` files: `PORT` for the server, `VITE_API_URL` for the client.
5. Copy the supplied logo image to `client/public/logo/little-fox-logo.jpeg`.
6. Configure `npm run dev` for both `client/` and `server/`.

### Phase 2 — Backend (Express + books.json)
1. Create `server.js` with Express, JSON parsing, and CORS enabled.
2. Create `data/books.json` with **6 placeholder books** (fake affiliate links, placeholder covers).
3. Create `data/settings.json` with logo name (Little Fox), Amazon profile URL, Pinterest profile URL (placeholders until provided).
4. Implement the four endpoints in Section 5.
5. Read the port from `.env`.
6. Test each endpoint (list, single, related, settings).

### Phase 3 — Frontend foundation
1. Set up React Router with `/` and `/book/:id`.
2. Create the API client (base URL from `VITE_API_URL`).
3. Set up Tailwind with brand color tokens (`[primary]`, `[accent]`, `[background]`) and dark mode.
4. Add global styles: smooth scrolling and keyboard focus styles.
5. Build shared components: `Header`, `Footer`, `CoverImage`, `ThemeToggle`, `Seo`.
   - Header: Little Fox logo image + nav (Home, Books, Contact). **No cart icon.**
   - `CoverImage`: lazy-loaded, alt text, clean placeholder in brand colors when the image is missing.
6. Mobile-first layout for all components.

### Phase 4 — Page 1: Home
1. **Header**: logo + simple nav (Home, Books, Contact).
2. **Hero banner**: headline "My Book Recommendations", short subtext, a large banner/collage built from the book cover images (placeholders until replaced), and a **"Browse Books"** button.
3. **"Find me on"** section (below hero): Amazon logo and Pinterest logo, each linking to `[AMAZON PROFILE URL]` and `[PINTEREST PROFILE URL]`, opening in a new tab.
4. **Book collection**: grid (or horizontal-scroll rows by category) of cover images loaded from `GET /api/books`. Clicking a cover goes to `/book/:id`.
5. **Footer**: logo, Amazon and Pinterest icons with links, Privacy policy, Terms, Contact, and an Amazon affiliate disclosure.

### Phase 5 — Page 2: Book Detail (`/book/:id`)
1. Large cover image on one side; title, author, and price on the other (data from `GET /api/books/:id`).
2. **Quantity selector**: minus and plus buttons, minimum 1. Plus adds one, minus removes one.
3. Big **"Buy Now"** button: opens that same book's `affiliateUrl` in a new tab with `rel="noopener sponsored"`.
4. Directly below the image and button: the book's `fullDescription`.
5. Further down: **"More books you may like"** — all other books from `GET /api/books/:id/related`. Each is clickable (goes to its own detail page) and has a **"Buy on Amazon"** button using its own `affiliateUrl`.
6. Only the owner's books and links appear anywhere on the site.

### Phase 6 — Extra requirements
- Cover image shown for every book; brand-color placeholder if missing.
- Smooth scrolling, lazy-loaded images, alt text, keyboard focus styles.
- Light and dark mode.
- SEO basics: page title, meta description, Open Graph tags per book page.
- CORS enabled on the backend; `.env` for API URL and port.

### Phase 7 — Documentation
Write `README.md` containing:
1. Steps to run the backend (`cd server`, `npm install`, `npm run dev`).
2. Steps to run the frontend (`cd client`, `npm install`, `npm run dev`).
3. How to add a new book: edit `server/data/books.json`.
4. How to set the `.env` values.

### Phase 8 — Verification checklist
- [ ] `npm install` and `npm run dev` work in both `client/` and `server/`
- [ ] All four API endpoints return the expected JSON
- [ ] Home page shows the Little Fox logo, hero, "Find me on", book collection, footer
- [ ] Clicking a cover opens `/book/:id`
- [ ] Quantity cannot go below 1
- [ ] "Buy Now" and "Buy on Amazon" open the correct `affiliateUrl` in a new tab with `rel="noopener sponsored"`
- [ ] "More books you may like" lists every other book
- [ ] No cart or checkout anywhere
- [ ] Missing cover image shows the placeholder
- [ ] Light and dark mode work; layout is good on phones
- [ ] Title, meta description, and Open Graph tags are set on book pages

## 8. Open Inputs (not provided — left as placeholders)

| Item | Placeholder |
|---|---|
| Primary / accent / background colors | `[primary]`, `[accent]`, `[background]` |
| Style | `[e.g. friendly, clean, modern]` |
| Site language | `[English / Tamil / both]` |
| Amazon profile URL | `[AMAZON PROFILE URL]` |
| Pinterest profile URL | `[PINTEREST PROFILE URL]` |
| Real book data and affiliate links | replace the 6 placeholder books |
| Hero subtext wording | not specified (only the headline was given) |
| Amazon / Pinterest logo artwork | not supplied; to be added |
| Privacy, Terms, Contact page content | not specified; only footer links were requested |
| Nav "Books" and "Contact" targets | not specified |
| Effect of quantity on the buy link | not specified; the selector is a UI control only, as there is no cart or checkout |
