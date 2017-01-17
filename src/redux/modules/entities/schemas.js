import { schema } from 'normalizr'

const brand = new schema.Entity('brands')

const node = new schema.Entity('nodes')

const account = new schema.Entity('accounts', {}, {
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const group = new schema.Entity('groups', {}, {
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const property = new schema.Entity('properties', {}, {
  idAttribute: 'published_host_id',
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const brandAccounts = new schema.Entity('brandAccounts', {
  accounts: [ account ]
})

const accountGroups = new schema.Entity('accountGroups', {
  groups: [ group ]
})

const groupProperties = new schema.Entity('groupProperties', {
  properties: [ property ]
})


export const Schemas = {
  brand,
  node,
  account,
  group,
  property,
  brandAccounts,
  accountGroups,
  groupProperties
}
