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
  idAttribute: (value, parent) => { return `${parent.id}-${value.pod_name}`},
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const pop = new schema.Entity('pops', {
  pods: [ pod ]
})

const pops = [ pop ]

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
  property,
  pop,
  pops,
  pod,
  footprint,
  brandAccounts,
  accountGroups,
  groupProperties
}
