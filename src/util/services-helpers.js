import { fromJS, List } from 'immutable'

export function getServicesIds (services) {
  const serv = services.toJS()

  return fromJS(serv.map(({ service_id, options }) => {
    return {
      id: service_id,
      options: options ? options.map(({option_id}) => option_id) : []
    }
  }))
}

export function getServicesFromIds (servicesIds = []) {
  return servicesIds.map(({ id, options }) => {
    return {
      service_id: id,
      options: options ? options.map((option_id) => ({ option_id })) : []
    }
  })
}

export function getLocationTypeFromBillingMeta (meta) {
  return meta.regions && meta.regions.length ? 'region' : 'global'
}

export function getServiceById (serviceInfo, id) {
  return serviceInfo ? serviceInfo.get(String(id)) : new Map()
}

export function getOptionById (serviceInfo, id) {
  const options = serviceInfo ? fromJS(serviceInfo.map(item => item.get('options')).valueSeq().toJS()).flatten(1) : List()

  return options.find(item => item.get('id') === id)
}

export function getDefaultService (service_id) {
  return fromJS({
    service_id,
    flow_direction: [],
    billing_meta: {
      charge_number: ''
    },
    options: []
  })
}

export function getDefaultOption (option_id) {
  return fromJS({
    option_id,
    billing_meta: {
      charge_number: ''
    }
  })
}

export function getServiceOptionsForGroup (serviceOptionsInfo, accountServices, groupServices) {
  const serviceIds = getServicesIds(accountServices).mergeDeep(getServicesIds(groupServices))

  return serviceIds.map(service => {
    const serviceInfoItem = serviceOptionsInfo.find(item => item.value === service.get('id'))
    return {
      ...serviceInfoItem,
      options: serviceInfoItem.options.filter(option => service.get('options').contains(option.value))
    }
  })
}
