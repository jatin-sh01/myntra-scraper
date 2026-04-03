# Myntra Scraper 🛍️

A 2-phase web scraping project that discovers Myntra categories and extracts product data into MongoDB using Node.js, Playwright, and ES modules.

## Project Overview

Myntra Scraper is a modular automation workflow built to:

- Scrape the Myntra homepage for category and subcategory links
- Structure category data into a clean category → subcategory hierarchy
- Randomly select a subcategory from MongoDB
- Scrape product listings from that subcategory page
- Store categories and products in MongoDB for later use

The codebase is intentionally small, readable, and easy to extend.

## Tech Stack

- Node.js
- JavaScript (ES6 modules)
- Playwright
- MongoDB
- dotenv

## Features

- 🔎 Category discovery from the Myntra homepage
- 🧩 Category → subcategory data structuring
- 🎲 Random subcategory selection for product scraping
- 🛡️ Browser automation with Playwright
- ⏳ Random scrolling and delays for more natural scraping behavior
- 🗃️ MongoDB-backed storage for structured data
- 🧱 Clean modular architecture

## Project Structure

```text
myntra-scraper/
├── index.js
├── categoryScraper.js
├── scraper.js
├── db.js
├── package.json
└── .env
```

### File Roles

- `index.js` - Main entry point and phase controller
- `categoryScraper.js` - Scrapes Myntra homepage links
- `scraper.js` - Scrapes products from a category page
- `db.js` - MongoDB connection helper
- `.env` - Environment variables

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/jatin-sh01/myntra-scraper.git
cd myntra-scraper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
```

### 4. Install Playwright browsers

```bash
npx playwright install
```

## Usage

The scraper runs in two phases controlled by the `MODE` variable in `index.js`.

### Phase 1: Category Discovery

Set:

```js
const MODE = "categories";
```

Then run:

```bash
node index.js
```

What it does:

- Opens the Myntra homepage
- Extracts relevant category links
- Groups subcategories under top-level categories like Men, Women, Kids, Home, and Beauty
- Saves the structured result in MongoDB

### Phase 2: Product Scraping

Set:

```js
const MODE = "products";
```

Then run:

```bash
node index.js
```

What it does:

- Reads categories from MongoDB
- Selects one valid subcategory at random
- Scrapes 50 to 100 products from that page
- Extracts product name, brand, price, product URL, and image URL
- Saves the product data into MongoDB

## Sample Output

### Categories Collection

```json
[
  {
    "category": "women",
    "subcategories": [
      {
        "name": "Dresses",
        "url": "https://www.myntra.com/..."
      }
    ]
  }
]
```

### Products Collection

```json
[
  {
    "name": "Printed Dress",
    "brand": "H&M",
    "price": "Rs. 1299",
    "link": "https://www.myntra.com/...",
    "image": "https://assets.myntassets.com/...",
    "category": "women",
    "subcategory": "Dresses"
  }
]
```

## Future Improvements

- Add retry logic for unstable pages
- Support pagination for deeper scraping
- Add deduplication before inserting products
- Export scraped data to JSON or CSV
- Add CLI flags instead of editing `MODE` manually
- Add structured logging and better error reporting

## Notes

- Ensure MongoDB is running before starting the scraper
- Myntra page structure may change, so selectors may need periodic updates
- Playwright browsers must be installed before the first run

## License

This project is intended for educational and personal use.