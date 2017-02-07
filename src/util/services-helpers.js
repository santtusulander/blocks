import { fromJS, List } from 'immutable'
import { REGION_LOCATION_TYPE, GLOBAL_LOCATION_TYPE } from '../constants/account-management-options'

export function getServicesIds (services = List()) {
  const serv = services.toJS()

  return fromJS(serv.map(({ service_id, options = [] }) => {
    return {
      id: service_id,
      options: options.map(({option_id}) => option_id)
    }
  }))
}

export function getServicesFromIds (servicesIds = []) {
  return servicesIds.map(({ id, options = [] }) => {
    return {
      service_id: id,
      options: options.map((option_id) => ({ option_id }))
    }
  })
}

export function getLocationTypeFromBillingMeta (meta) {
  return meta.regions && meta.regions.length ? REGION_LOCATION_TYPE : GLOBAL_LOCATION_TYPE
}

export function getServiceById (serviceInfo, id) {
  return serviceInfo ? serviceInfo.get(String(id)) : Map()
}

export function getOptionById (serviceInfo, id) {
  const options = serviceInfo ? fromJS(serviceInfo.map(item => item.get('options')).valueSeq().toJS()).flatten(1) : List()

  return options.find(item => item.get('id') === id)
}

export function getDefaultService (service_id) {
  const defaultObj = {
    service_id,
    billing_meta: {
      flow_direction: [],
      charge_number: ''
    },
    options: []
  }
  
  //flow_direction related only for media delivery service
  if (service_id !== 1) {
    delete defaultObj.billing_meta.flow_direction
  }

  return fromJS(defaultObj)
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
  const accountServiceIds = getServicesIds(accountServices)
  const groupServiceIds = getServicesIds(groupServices)

  return serviceOptionsInfo.reduce((acc, service) => {
    const accountItem = accountServiceIds.find(item => service.value === item.get('id'))
    const groupItem = groupServiceIds.find(item => service.value === item.get('id'))

    if (accountItem || groupItem) {
      const accountOptions = accountItem ? accountItem.get('options') : List()
      const groupOptions = groupItem ? groupItem.get('options') : List()
      const allOptions = accountOptions.concat(groupOptions)
      acc.push( {
        ...service,
        options: service.options.filter(option => allOptions.contains(option.value))
      })
    }
    return acc
  }, [])
}
