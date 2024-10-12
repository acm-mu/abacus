import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor
} from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Problems: CollectionConfig = {
  slug: 'blue-problems',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'practice',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'pid',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      
      required: true,
    },
  ],

  versions: {
    drafts: {
      autosave: {
        interval: 100,
      }
    },
    maxPerDoc: 50,
  }
}