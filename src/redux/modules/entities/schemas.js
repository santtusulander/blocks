import { schema } from 'normalizr'

const property = new schema.Entity('properties', {}, {
  idAttribute: 'published_host_id',
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const groupProperties = new schema.Entity('groupProperties', {
  properties: [ property ]
})


export const Schemas = {
  property,
  groupProperties
}
