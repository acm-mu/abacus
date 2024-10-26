import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor
} from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const BlueProblems: CollectionConfig = {
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
      name: 'problemId',
      type: 'text',
    },
    {
      name: 'cpu_time_limit',
      type: 'number',
    },
    {
      name: 'memory_limit',
      type: 'number',
    },
    {
      name: 'skeletons',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'skeletons',
        },
      ],
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
        }
      ],
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