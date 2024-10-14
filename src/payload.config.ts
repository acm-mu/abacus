// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Admins } from './collections/Admins'
import { Pages } from './collections/Pages'
import { BlueProblems } from './collections/BlueProblems'
import { Competition } from './globals/competition'
import { BlueRules } from './globals/bluerules'
import { Skeletons } from './collections/skeletons'
import { Faqs } from './collections/Faqs'
import { BlueSubmissions } from './collections/BlueSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  routes: {
    admin: "/admin"
  },
  globals: [Competition, BlueRules],
  collections: [Admins, Faqs, Users, Media, Pages, BlueProblems, Skeletons, BlueSubmissions],
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
