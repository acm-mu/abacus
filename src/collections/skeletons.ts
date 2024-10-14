import { CollectionConfig } from "payload";

export const Skeletons: CollectionConfig = {
  slug: 'skeletons',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/skeletons',
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
    },
  ],
}