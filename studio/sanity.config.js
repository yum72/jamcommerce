import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy .env.example to .env and fill it in.'
  )
}

export default defineConfig({
  name: 'jamcommerce',
  title: 'JAMcommerce',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
})
