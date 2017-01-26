import { fromJS, List } from 'immutable'

export function getServicesIDs (services) { //todo without transform toJS
  const serv = services.toJS()

  return fromJS(serv.map(({ service_id, options }) => {
    return {
      id: service_id,
      options: options ? options.map(({option_id}) => option_id) : []
    }
  }))
}

export function getLocationTypeFromBillingMeta (meta) {
  return meta.regions && meta.regions.length ? 'region' : 'global'
}

export const getServiceById = (serviceInfo, id) => {
  return serviceInfo ? serviceInfo.get(String(id)) : new Map()
}

export const getOptionById = (serviceInfo, id) => {
  const options = serviceInfo ? fromJS(serviceInfo.map(item => item.get('options')).valueSeq().toJS()).flatten(1) : List()

  return options.find(item => item.get('id') === id)
}

export const getDefaultService = (id) => {
  return fromJS({
    service_id: id,
    flow_direction: [],
    billing_meta: {
      charge_number: ''
    },
    options: []
  })
}

export const getDefaultOption = (id) => {
  return fromJS({
    option_id: id,
    billing_meta: {
      charge_number: ''
    }
  })
}
