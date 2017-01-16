import {Schema, arrayOf, valuesOf} from 'normalizr'

const brand = new Schema('brands')
const account = new Schema('accounts')
const group = new Schema('groups')
const property = new Schema('properties', {idAttribute: 'published_host_id'})

const groupProperties = new Schema('groupProperties', {idAttribute: 'group'})
const accountGroups = new Schema('accountGroups', {idAttribute: 'account'})
const entityId = new Schema('entityId')

accountGroups.define({
  account: account,
  groups: arrayOf( group )
})

groupProperties.define({
  properties: valuesOf( entityId )
})

/*property.define({
  brand: brand,
  account: account,
  group: group
})*/

export const Schemas = {
  brand,
  account,
  accountGroups,
  group,
  property,
  groupProperties
}

/*
  REMOVE

 brandSchema.define({
  accounts: arrayOf(accountSchema)
})

accountSchema.define({
  groups: arrayOf(groupSchema)
})

groupSchema.define({
  properties: arrayOf(propertySchema)
})
*/
