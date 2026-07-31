/**
 * Barcode field.
 *
 * The pre-2026 studio had this as a custom plugin whose input component
 * rendered a live barcode preview using the Sanity v1 part system. That system
 * no longer exists, and the preview was cosmetic, so this keeps the same data
 * shape as a plain object type. Documents written by the old studio still read
 * back correctly.
 */
export default {
  name: 'barcode',
  title: 'Barcode',
  type: 'object',
  preview: {
    select: { title: 'barcode', subtitle: 'format' }
  },
  fields: [
    { name: 'barcode', title: 'Barcode', type: 'string' },
    {
      name: 'format',
      title: 'Barcode format',
      type: 'string',
      options: {
        list: [
          'CODE39', 'CODE128', 'CODE128A', 'CODE128B', 'CODE128C',
          'EAN13', 'EAN8', 'EAN5', 'EAN2', 'UPC', 'UPCE',
          'ITF14', 'ITF', 'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
          'pharmacode', 'codabar', 'GenericBarcode'
        ]
      }
    }
  ]
}
