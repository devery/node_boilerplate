import { Parser } from 'json2csv'

export const generateCsv = (attributes, data) => {
  const fields = [
    {
      value: 'title',
      label: 'Item Title'
    },
    ...attributes.map(a => ({
      value: a.id,
      label: a.title
    })),
    {
      value: 'sku',
      label: 'SKU'
    }
  ]
  const items = data.map(item => {
    return {
      title: item.title,
      ...item.values,
      sku: item.sku
    }
  })
  return Promise.resolve().then(() => {
    const json2csvParser = new Parser({ fields, delimiter: '\t' })
    const csv = json2csvParser.parse(items)
    return csv
  })
}
