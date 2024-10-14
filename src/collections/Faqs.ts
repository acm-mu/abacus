import type { CollectionConfig } from "payload";

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  fields: [
    {
      name: 'question',
      type: 'text'
    },
    {
      name: 'answer',
      type: 'richText',
    },
  ],
}