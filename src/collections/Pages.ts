import { slugField } from '@/fields/slug'
import { FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

// import { authenticated } from '../../access/authenticated'
// import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
// import { Archive } from '../../blocks/ArchiveBlock/config'
// import { CallToAction } from '../../blocks/CallToAction/config'
// import { Content } from '../../blocks/Content/config'
// import { FormBlock } from '../../blocks/Form/config'
// import { MediaBlock } from '../../blocks/MediaBlock/config'
// import { hero } from '@/heros/config'
// import { slugField } from '@/fields/slug'
// import { populatePublishedAt } from '../../hooks/populatePublishedAt'
// import { generatePreviewPath } from '../../utilities/generatePreviewPath'
// import { revalidatePage } from './hooks/revalidatePage'

// import {
//   MetaDescriptionField,
//   MetaImageField,
//   MetaTitleField,
//   OverviewField,
//   PreviewField,
// } from '@payloadcms/plugin-seo/fields'
export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  //   create: authenticated,
  //   delete: authenticated,
  //   read: authenticatedOrPublished,
  //   update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // livePreview: {
    //   url: ({ data }) => {
    //     const path = generatePreviewPath({
    //       slug: typeof data?.slug === 'string' ? data.slug : '',
    //       collection: 'pages',
    //     })

    //     const path = 

    //     return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    //   },
    // },
    // preview: (data) => {
    //   const path = generatePreviewPath({
    //     slug: typeof data?.slug === 'string' ? data.slug : '',
    //     collection: 'pages',
    //   })

    //   return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    // },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tabTitle',
      type: 'text',
      label: 'Tab Title',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
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
      label: false,
      required: true,
    },
    ...slugField(),
  ],
  // hooks: {
  //   afterChange: [revalidatePage],
  //   beforeChange: [populatePublishedAt],
  // },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
