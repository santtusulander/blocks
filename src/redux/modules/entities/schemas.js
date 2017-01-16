import { schema } from 'normalizr'

const brand = new schema.Entity('brands')

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

const brandAccounts = new schema.Entity('brandAccounts', {
  accounts: [ account ]
})

const accountGroups = new schema.Entity('accountGroups', {
  groups: [ group ]
})


export const Schemas = {
  brand,
  account,
  accountGroups,
  brandAccounts
}
