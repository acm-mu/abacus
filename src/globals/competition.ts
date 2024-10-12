import type { CollectionConfig, GlobalConfig } from 'payload'

export const Competition: GlobalConfig = {
  slug: 'competition',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'practiceName',
      type: 'text',
      required: true,
    },
    {
      name: 'practiceStartDate',
      type: 'date',
      required: true,
    },
    {
      name: 'practiceEndDate',
      type: 'date',
      required: true,
    },
  ],
}
