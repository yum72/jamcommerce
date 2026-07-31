import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.example to .env.local and fill it in.'
  )
}

export default createClient({
  projectId,
  dataset,
  // Pin the API version. Without one the client warns and follows whatever is
  // current, so a Sanity release can change query behaviour under a deployed site.
  apiVersion: '2024-01-01',
  // Served from the CDN, which is cheaper and faster. Pages are statically
  // generated anyway, so the small staleness window costs nothing here.
  useCdn: true
})
