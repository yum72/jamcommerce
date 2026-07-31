# JAMcommerce

A JAMstack storefront: Next.js reading products from Sanity, statically
generated, with a cart that works without any payment provider attached.

**Status:** working, completed and modernized 2026 · Node 20+

Two apps in one repo. `studio/` is where products are edited; `web/` is the
storefront that reads them.

## What it does

- Home page with a CMS-editable hero and a row of products per category
- Category pages, generated from whatever categories exist in Sanity
- Product pages with an image gallery and Portable Text descriptions
- A cart with quantity controls that survives a refresh
- Navigation built from the categories you flag as "show on nav"

Every page is prerendered at build time, so the HTML a crawler receives is the
full page rather than an empty shell.

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
| `web/.env.local` | `NEXT_PUBLIC_SNIPCART_API_KEY` | Optional, see below |

## Checkout

The built-in cart is self-contained: add, change quantity, remove, and it
persists to `localStorage`. It has no payment step, because taking payments
needs an account with someone.

Every "Add to cart" button also carries Snipcart's `data-item-*` attributes. Set
`NEXT_PUBLIC_SNIPCART_API_KEY` and Snipcart's own cart and checkout activate on
top of the same buttons. Leave it unset and nothing about the store breaks.

## Stack

| | |
|---|---|
| Storefront | Next.js 15, React 19 |
| CMS | Sanity Studio 6 |
| State | Redux Toolkit, redux-persist |
| Styling | Tailwind 4 |
| Content | Portable Text |

## Content model

`product` is the main document, with a `defaultProductVariant` holding price,
SKU, weight and images, and optional extra `variants`. Products reference
`category` documents, which are what the nav and the category pages are built
from. `heroSection` drives the home page banner, and only the one flagged active
is used. `vendor` is available for attribution.

Titles and descriptions use locale objects, so `title.en` rather than `title`, in
case a second language is needed later.

## Notes on the 2026 rewrite

The public version of this repo stopped in 2020 with the header, footer, cart
and styling unbuilt. Those were finished in a private branch, and this brings
that work across and modernizes it: Next 9 to 15, React 16 to 19, Sanity Studio
v1 to v6, Tailwind 1 to 4, and hand-written Redux to Redux Toolkit.

Three things worth knowing if you compare against the old code.

The Sanity project ID and the Snipcart key were hardcoded in source. Both are
public in the sense that they ship to the browser, but both point at specific
accounts, so they are environment variables now.

The old `_app.js` passed the page itself as `PersistGate`'s `loading` prop, which
rendered the whole tree twice. Gating on rehydration at all is the wrong call
here: it makes the prerendered HTML of every page empty, which throws away the
reason to use static generation on a storefront. There is no `PersistGate` now;
the cart rehydrates a moment after mount and the badge updates then.

The barcode field was a Sanity v1 plugin whose custom input drew a live barcode.
The part system it relied on no longer exists, so it is a plain object type with
the same shape. Existing documents read back fine.

## License

MIT
