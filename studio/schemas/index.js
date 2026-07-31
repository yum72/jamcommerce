import blockContent from './blockContent'
import category from './category'
import product from './product'
import vendor from './vendor'
import productVariant from './productVariant'
import heroSection from './heroSection'
import barcode from './barcode'

import localeString from './locale/String'
import localeText from './locale/Text'
import localeBlockContent from './locale/BlockContent'

/**
 * Sanity v3 onwards takes a plain array of types. The v1 studio built this with
 * createSchema() and concatenated `all:part:@sanity/base/schema-type`, both of
 * which were removed with the part system.
 */
export const schemaTypes = [
  // Documents
  product,
  vendor,
  category,
  heroSection,
  // Objects, usable as { type: 'name' } inside the documents above
  blockContent,
  productVariant,
  barcode,
  localeString,
  localeText,
  localeBlockContent
]
