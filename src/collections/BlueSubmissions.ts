import { CollectionConfig } from "payload";

export const BlueSubmissions: CollectionConfig = {
  slug: 'blue-submissions',
  fields: [
    {
      name: 'problem',
      type: 'relationship',
      relationTo: 'blue-problems',
    },
    {
      name: 'source',
      type: 'code',
    },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'released',
      type: 'checkbox',
    },
    {
      name: 'tests',
      type: 'array',
      fields: [
        {
          name: 'input',
          type: 'code',
        },
        {
          name: 'expected',
          type: 'code',
        },
        {
          name: 'stdout',
          type: 'code',
        },
        {
          name: 'result',
          type: 'text',
        },
      ]
    }
  ],
}