import { fromJS, List } from 'immutable'

import {
  REGION_LOCATION_TYPE,
  GLOBAL_LOCATION_TYPE
} from '../constants/account-management-options'

import {
  MEDIA_DELIVERY_SERVICE_ID,
  VOD_STREAMING_SERVICE_ID,
  MEDIA_DELIVERY_SECURITY_OPTION_ID,
  MEDIA_DELIVERY_TOKEN_AUTH_OPTION_ID,
  MEDIA_DELIVERY_CONTENT_TARGETTING_OPTION_ID,
  VOD_STREAMING_SECURITY_OPTION_ID,
  VOD_STREAMING_TOKEN_AUTH_OPTION_ID,
  VOD_STREAMING_CONTENT_TARGETTING_OPTION_ID,

  MEDIA_DELIVERY_SECURITY,
  MEDIA_DELIVERY_TOKEN_AUTH,
  MEDIA_DELIVERY_CONTENT_TARGETTING,
  VOD_STREAMING_SECURITY,
  VOD_STREAMING_TOKEN_AUTH,
  VOD_STREAMING_CONTENT_TARGETTING
} from '../constants/service-permissions'


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

export function getServiceByOptionId (serviceInfo, id) {
  return serviceInfo ? serviceInfo.find(service => service.get('options').find(option => option.get('id') === id)) : Map()
}

export function getDefaultService (service_id) {
  const defaultObj = {
    service_id,
    billing_meta: {
      flow_direction: []
    },
    options: []
  }
  
  if (service_id !== MEDIA_DELIVERY_SERVICE_ID) {
    delete defaultObj.billing_meta.flow_direction
  }

  return fromJS(defaultObj)
}

export function getDefaultOption (option_id) {
  return fromJS({
    option_id,
    billing_meta: {}
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

export function getServicePermissions (group) {
  let servicePermissions = List()
  const services = group.get('services') || List()
  const mediaDeliveryService = services.find(service => service.get('service_id') === MEDIA_DELIVERY_SERVICE_ID)
  const VODStreamingService = services.find(service => service.get('service_id') === VOD_STREAMING_SERVICE_ID)

  if (mediaDeliveryService && mediaDeliveryService.size) {
    mediaDeliveryService.get('options').forEach(option => {
      if (option.get('option_id') === MEDIA_DELIVERY_SECURITY_OPTION_ID) {
        servicePermissions = servicePermissions.push(MEDIA_DELIVERY_SECURITY)
      }

      if (option.get('option_id') === MEDIA_DELIVERY_TOKEN_AUTH_OPTION_ID) {
        servicePermissions = servicePermissions.push(MEDIA_DELIVERY_TOKEN_AUTH)
      }

      if (option.get('option_id') === MEDIA_DELIVERY_CONTENT_TARGETTING_OPTION_ID) {
        servicePermissions = servicePermissions.push(MEDIA_DELIVERY_CONTENT_TARGETTING)
      }
    })
  }

  if (VODStreamingService && VODStreamingService.size) {
    VODStreamingService.get('options').forEach(option => {
      if (option.get('option_id') === VOD_STREAMING_SECURITY_OPTION_ID) {
        servicePermissions = servicePermissions.push(VOD_STREAMING_SECURITY)
      }

      if (option.get('option_id') === VOD_STREAMING_TOKEN_AUTH_OPTION_ID) {
        servicePermissions = servicePermissions.push(VOD_STREAMING_TOKEN_AUTH)
      }

      if (option.get('option_id') === VOD_STREAMING_CONTENT_TARGETTING_OPTION_ID) {
        servicePermissions = servicePermissions.push(VOD_STREAMING_CONTENT_TARGETTING)
      }
    })
  }

  return servicePermissions
}

export function getRegionsInfoOptions (regionsInfo) {
  return regionsInfo.map(region => ({
    value: region.get('region_code'),
    label: region.get('description')
  })).toJS()
}
