export default {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'isActive',
      title: 'Active?',
      type: 'boolean'
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string'
    },
    {
      name: 'heroButtonCategory',
      title: 'Button Category',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage'
    }
  }
}
