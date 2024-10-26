import type { CollectionConfig } from 'payload'

export const Superusers: CollectionConfig = {
  slug: 'superusers',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
