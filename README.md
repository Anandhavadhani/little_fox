# Little Fox

Little Fox is a full-stack affiliate book recommendation website. The app uses a Node.js + Express backend for the REST API and a React + Vite + Tailwind frontend for the storefront experience.

## Run the backend

1. Open a terminal and go to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
4. The backend should run on the port in `server/.env` (default: `PORT=5000` unless you change it).

## Run the frontend

1. Open a second terminal and go to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. The app should run in the browser using the local Vite dev server.

## Set the .env values

### Server: `server/.env`
Create or edit `server/.env` and set:

```env
PORT=5000
```

### Client: `client/.env`
Create or edit `client/.env` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

If the server port changes, update `VITE_API_URL` to match it.

## Add a new book

Edit `server/data/books.json` to add a new item. Each book should follow this structure:

```json
{
  "id": "book-7",
  "title": "The Little Fox Guide",
  "author": "A. Writer",
  "coverImage": "/covers/little-fox-guide.jpg",
  "shortDescription": "A short summary of this book recommendation.",
  "fullDescription": "A longer description of the book and why it is included in this recommendation list.",
  "price": 19.99,
  "affiliateUrl": "https://www.amazon.com/your-affiliate-link",
  "category": "Fiction"
}
```

Notes:
- `id` should be unique.
- `coverImage` can be a local image path or an external URL.
- If `coverImage` is missing or broken, the app shows a branded placeholder cover.
- `affiliateUrl` is the owner’s Amazon affiliate link.
- `category` is used for grouping and display in the site.

## Open Inputs

These items were not specified in the brief and are intentionally kept as placeholders:

- Brand colors: `[primary]`, `[accent]`, `[background]`
- Style: `[e.g. friendly, clean, modern]`
- Site language: `[English / Tamil / both]`
- Amazon profile URL: `[AMAZON PROFILE URL]`
- Pinterest profile URL: `[PINTEREST PROFILE URL]`
- Real book data and affiliate links: replace the placeholder entries in `server/data/books.json`
- Hero subtext wording: not specified, only the headline was required
- Amazon / Pinterest logo artwork: not supplied
- Privacy policy, Terms, and Contact content: not specified
- Affiliate disclosure wording: placeholder wording only

## Project structure summary

```text
little/
├── README.md
├── ARCHITECTURE.md
├── client/
│   ├── .env
│   ├── package.json
│   └── src/
├── server/
│   ├── .env
│   ├── package.json
│   ├── data/
│   │   ├── books.json
│   │   └── settings.json
│   └── server.js
└── client/public/logo/little-fox-logo.jpeg
```

## Notes

- There is no cart and no checkout.
- Every purchase action opens the relevant book’s affiliate URL in a new tab.
- The frontend and backend are intentionally simple and easy to edit later.
