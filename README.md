# JAMcommerce

A JAMstack storefront: Next.js prerenders every page from a Sanity catalogue at
build time, so the whole shop ships as static files with no server behind it.
The cart runs in the browser and works without any payment provider attached.

**Status:** working · Node 20+

Two apps in one repo. `studio/` is where products are edited; `web/` is the
storefront that reads them.

## What JAMstack means here

JAMstack is JavaScript, APIs and Markup: pages are built to static markup ahead
of time, and anything dynamic is added in the browser by calling APIs. No
application server sits in the request path.

This repo is a worked example of that for a shop, which is the case people
usually assume needs a server:

| Layer | Here |
|---|---|
| **Markup** | Next.js prerenders every product and category page to static HTML at deploy. |
| **APIs** | Sanity supplies the catalogue at build; Snipcart handles checkout in the browser. |
| **JavaScript** | The cart lives entirely client-side and persists to `localStorage`. |

What that buys you:

- **Nothing to run.** The output is a folder of files on a CDN. No server to
  keep alive, no database to back up, no cold start, and nothing to patch.
- **Fast and cheap by default.** A static file from an edge cache is about as
  quick as the web gets, and it costs the same whether ten people visit or ten
  thousand.
- **Indexable.** A crawler gets the finished page on the first request, not an
  empty shell that fills in later. This is where most SPA storefronts lose.
- **Nothing to attack.** No runtime, no database and no server-side session
  means most of the usual attack surface simply is not there.

The trade is that content changes need a rebuild, which is why the sitemap is
generated per request rather than baked in, and why the CMS is worth having:
editors change the catalogue without touching code, and a webhook can rebuild.

The cart is deliberately self-contained, so the whole thing runs end to end
without signing up for a payment provider. Attach one when you actually need to
take money.

## What it does

- Home page with a CMS-editable hero and a row of products per category
- Category pages, generated from whatever categories exist in Sanity, sortable
  by price, name or date
- Product pages with an image gallery, Portable Text descriptions and a row of
  related products
- A cart with quantity controls that survives a refresh, and a saved-items list
  alongside it
- Instant search over the whole catalogue with no API call — the index is built
  at deploy time and filtered in the browser
- Navigation and a promo bar built from the CMS: the categories you flag as
  "show on nav" and whichever hero campaign is active
- Per-page titles, meta descriptions, Open Graph tags and Product structured data
- A sitemap that stays current as the catalogue changes

## Tech stack, and why

Next.js 15, React 19, Sanity Studio 6, Redux Toolkit 2, Tailwind 4.

| Choice | Why this one |
|---|---|
| **Next.js**, Pages Router, SSG | Every product and category page is prerendered at build. Static files, no server, and full HTML for crawlers on the first request. |
| **Sanity** | The catalogue is edited in a real CMS, not in code, so adding a product does not need a developer. Its CDN is free to read from and content is queried with GROQ rather than assembled by hand. |
| **Portable Text** | Product descriptions are stored as structured data rather than an HTML blob, so the same copy can be rendered differently on web, in an app, or in a feed. |
| **Redux Toolkit** | The cart and the saved-items list are the only client state. Each is one small slice, persisted to `localStorage` by a short store subscription rather than a dependency. |
| **Tailwind 4** | CSS-first config, and only the utilities actually used end up in the bundle. |
| **Snipcart**, optional | Real checkout when you want it, without building payments. Not loaded at all when no key is set. |

## Performance and SEO

Static generation is only half of it. Getting indexed well needs the pages to
actually say something:

- **Per-page titles and descriptions**, taken from the product, category or
  hero, so no two pages compete for the same search result.
- **One `<h1>` per page**, carrying the product or category name.
- **Product structured data** (JSON-LD) on every product page, with price,
  availability and image, which is what puts price and stock into the search
  result itself instead of a plain blue link.
- **Open Graph and Twitter cards**, so a pasted link previews with the product
  photo rather than a bare URL.
- **Canonical URLs**, emitted only when `NEXT_PUBLIC_SITE_URL` is set. A
  canonical pointing at the wrong origin is worse than none.
- **`/sitemap.xml`** built per request from Sanity, so products added through the
  CMS appear without a rebuild. **`/robots.txt`** points at it, excludes the
  cart, and blocks preview deployments outright so branch URLs cannot compete
  with the real site.
- **Alt text on every image**, dimensions to stop layout shift, lazy loading
  below the fold, and the hero marked high priority as the LCP element.
- **No third-party requests by default.** Snipcart's stylesheet, script and two
  preconnects only load when a key is configured.

Every page is prerendered, so the HTML a crawler receives is the full page rather
than an empty shell.

## Setup

You need a Sanity project. `npx sanity init` inside `studio/` will create one.

```bash
# CMS
cd studio
npm install
cp .env.example .env        # add SANITY_STUDIO_PROJECT_ID
npm run dev                 # http://localhost:3333

# storefront, in another terminal
cd web
npm install
cp .env.example .env.local  # add NEXT_PUBLIC_SANITY_PROJECT_ID
npm run dev                 # http://localhost:3000
```

The storefront reads at build time, so add a few products in the studio first or
the pages will be empty.

## Configuration

| Where | Variable | For |
|---|---|---|
| `studio/.env` | `SANITY_STUDIO_PROJECT_ID` | Which Sanity project to edit |
| `studio/.env` | `SANITY_STUDIO_DATASET` | Defaults to `production` |
| `web/.env.local` | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Which project to read |
| `web/.env.local` | `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production` |
| `web/.env.local` | `NEXT_PUBLIC_SITE_URL` | Canonical and Open Graph URLs. Omitted if unset. |
| `web/.env.local` | `NEXT_PUBLIC_SITE_NAME` | Title suffix and `og:site_name` |
| `web/.env.local` | `NEXT_PUBLIC_SNIPCART_API_KEY` | Optional, see below |

## Checkout

The built-in cart is self-contained: add, change quantity, remove, and it
persists to `localStorage`. It has no payment step, because taking payments
needs an account with someone.

Every "Add to cart" button also carries Snipcart's `data-item-*` attributes. Set
`NEXT_PUBLIC_SNIPCART_API_KEY` and Snipcart's own cart and checkout activate on
top of the same buttons. Leave it unset and nothing about the store breaks.

## Content model

`product` is the main document, with a `defaultProductVariant` holding price,
SKU, weight and images, and optional extra `variants`. Products reference
`category` documents, which are what the nav and the category pages are built
from. `heroSection` drives the home page banner, and only the one flagged active
is used. `vendor` is available for attribution.

Titles and descriptions use locale objects, so `title.en` rather than `title`, in
case a second language is needed later. `barcode` is a plain object type holding
the format and value; it is not rendered anywhere by default.

## Design

The palette is a deep forest green with warm cream for the hero and category
tiles, and one flat grey that all product photography sits on. Headings, prices
and buttons are set in Plus Jakarta Sans; body copy is Inter. Both are
self-hosted through `next/font`, so no page waits on a request to Google Fonts
before it can paint.

Every colour and both font stacks are defined once in `web/styles/index.css`
under Tailwind 4's `@theme`, which is the only file to open to reskin the store.

## License

MIT
