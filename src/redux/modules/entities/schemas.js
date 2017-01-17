import { schema } from 'normalizr'

const brand = new schema.Entity('brands')
const footprint = new schema.Entity('footprint')

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

const pod = new schema.Entity('pods', {
  footprints: [ footprint ]
}, {
  idAttribute: `cloud-location-id`
})


const pop = new schema.Entity('pops', {
  pods: [ pod ]
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
  account,
  group,
  property,
  pop,
  pod,
  footprint,
  brandAccounts,
  accountGroups,
  groupProperties
}
