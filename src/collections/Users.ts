import { auth } from 'node_modules/payload/dist/auth/operations/auth'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    // Email added by default
    // Add more fields as needed
  ],
}
