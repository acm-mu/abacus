// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/media'
import { Users } from './collections/users'
import { Superusers } from './collections/superusers'
import { Pages } from './collections/pages'
import { BlueProblems } from './collections/blue-problems'
import { Competition } from './globals/competition'
import { BlueRules } from './globals/blue-rules'
import { Skeletons } from './collections/skeletons'
import { Faqs } from './collections/faqs'
import { BlueSubmissions } from './collections/blue-submissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Superusers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: "/admin"
  },
  globals: [Competition, BlueRules],
  collections: [Superusers, Faqs, Users, Media, Pages, BlueProblems, Skeletons, BlueSubmissions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
