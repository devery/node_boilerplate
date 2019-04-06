import { chain, isEmpty, take, assign } from 'lodash'
import {
  NOT_DIGITS_LETTERS_REGEX,
  ONLY_DIGITS_REGEX,
  ONLY_VOWELS_REGEX
} from '../constants/regExps'

export const skuValue = (list, item, attributes) => {
  const dividerRegex = new RegExp(list.divider, 'g')
  return chain(attributes)
    .map(a => {
      let itm = item.values[a.id]
      if (list.removeVowels) {
        itm = itm.replace(ONLY_VOWELS_REGEX, '')
      }
      if (list.removeDigits) {
        itm = itm.replace(ONLY_DIGITS_REGEX, '')
      }
      if (list.removeSpecial) {
        itm = itm.replace(NOT_DIGITS_LETTERS_REGEX, '')
      }
      if (list.removeDividers) {
        itm = itm.replace(dividerRegex, '')
      }
      return itm.substring(0, list.charactersCount)
    })
    .join(list.divider)
    .value()
}

export const filterAttributes = attributes => {
  return attributes.filter(a => a && a.values && !isEmpty(a.values))
}

export const getSKUItems = (list, items) => {
  const attributes = filterAttributes(list.attributes)
  const newItems = items.map(item => {
    const sku = skuValue(list, item, attributes)
    return {
      _id: item._id,
      values: item.values,
      sku
    }
  })
  const sortedItems = []
  newItems.forEach((itm, index) => {
    const prevItems = take(newItems, index)
    const sameSKUCount = prevItems.filter(pi => pi.sku === itm.sku).length
    sortedItems.push({
      _id: itm._id,
      sku: itm.sku,
      values: itm.values,
      skuDuplicateIndex: sameSKUCount
    })
  })
  return sortedItems
}

export const autoFillItems = list => {
  const { attributes: oldAttributes, _id: id, title: listTitle } = list
  const attributes = filterAttributes(oldAttributes)
  const newItems = []
  switch (attributes.length) {
    case 1:
      attributes[0].values.forEach(a => {
        const newItem = {
          values: {
            [attributes[0].id]: a
          },
          isPosted: false
        }
        newItems.push(newItem)
      })
      break

    case 2:
      attributes[0].values.forEach(a0 => {
        attributes[1].values.forEach(a1 => {
          const newItem = {
            values: {
              [attributes[0].id]: a0,
              [attributes[1].id]: a1
            },
            isPosted: false
          }
          newItems.push(newItem)
        })
      })
      break

    case 3:
      attributes[0].values.forEach(a0 => {
        attributes[1].values.forEach(a1 => {
          attributes[2].values.forEach(a2 => {
            const newItem = {
              values: {
                [attributes[0].id]: a0,
                [attributes[1].id]: a1,
                [attributes[2].id]: a2
              },
              isPosted: false
            }
            newItems.push(newItem)
          })
        })
      })
      break

    case 4:
      attributes[0].values.forEach(a0 => {
        attributes[1].values.forEach(a1 => {
          attributes[2].values.forEach(a2 => {
            attributes[3].values.forEach(a3 => {
              const newItem = {
                values: {
                  [attributes[0].id]: a0,
                  [attributes[1].id]: a1,
                  [attributes[2].id]: a2,
                  [attributes[3].id]: a3
                },
                isPosted: false
              }
              newItems.push(newItem)
            })
          })
        })
      })
      break

    case 5:
      attributes[0].values.forEach(a0 => {
        attributes[1].values.forEach(a1 => {
          attributes[2].values.forEach(a2 => {
            attributes[3].values.forEach(a3 => {
              attributes[4].values.forEach(a4 => {
                const newItem = {
                  values: {
                    [attributes[0].id]: a0,
                    [attributes[1].id]: a1,
                    [attributes[2].id]: a2,
                    [attributes[3].id]: a3,
                    [attributes[4].id]: a4
                  },
                  isPosted: false
                }
                newItems.push(newItem)
              })
            })
          })
        })
      })
      break

    default:
      attributes[0].values.forEach(a0 => {
        attributes[1].values.forEach(a1 => {
          attributes[2].values.forEach(a2 => {
            attributes[3].values.forEach(a3 => {
              attributes[4].values.forEach(a4 => {
                attributes[5].values.forEach(a5 => {
                  const newItem = {
                    values: {
                      [attributes[0].id]: a0,
                      [attributes[1].id]: a1,
                      [attributes[2].id]: a2,
                      [attributes[3].id]: a3,
                      [attributes[4].id]: a4,
                      [attributes[5].id]: a5
                    },
                    isPosted: false
                  }
                  newItems.push(newItem)
                })
              })
            })
          })
        })
      })
      break
  }
  const skuItems = getSKUItems(list, newItems)
  return skuItems.map(item => {
    return assign(item, {
      title: `${list.title} ${Object.values(item.values).join(' ')}`,
      product: id
    })
  })
}
