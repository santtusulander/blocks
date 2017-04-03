/**
 * Get list of servives
 * @param  {} redux state state
 * @return {Map}       services
 */
export const getServicesInfo = (state) => {
  return state.serviceInfo.services
}

/**
 * Get list of providerTypes
 * @param  {} redux state state
 * @return {Map}       services
 */
export const getProviderTypes = (state) => {
  return state.serviceInfo && state.serviceInfo.providerTypes
}

/***
 * Get service by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {Map} service
 */
export const getServiceById = (state, id) => {
  return state.serviceInfo.services && state.serviceInfo.services.get(String(id))
}

/***
 * Get providerType by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {Map} service
 */
export const getProviderTypeById = (state, id) => {
  return state.serviceInfo.providerTypes && state.serviceInfo.providerTypes.get(String(id))
}


/***
 * Get Provider Types for dropdown
 * @param  {} state from redux
 * @return []
 */
export const getProviderTypeOptions = (state) => {
  return state.serviceInfo.providerTypes.reduce((acc, type) => {
    acc.push({
      label: type.get('name'),
      value: type.get('id')
    })

    return acc
  }, [])
}

/***
 * Get Serviceoptions for MultiOptionSelector
 * @param  {} state from redux
 * @param  (Number||"") providerType
 * @return []
 */
export const getServiceOptions = (state, providerType) => {
  if (!providerType || providerType === "") {return}

  const providerServices = state.serviceInfo.providerTypes.getIn([String(providerType), 'services'])

  return providerServices && providerServices.reduce((acc, serviceId) => {
    const service = state.serviceInfo.services.get(String(serviceId))

    acc.push({
      label: service.get('name'),
      value: service.get('id'),
      requires_charge_number: service.get('requires_charge_number'),
      supports_regional_billing: service.get('supports_regional_billing'),
      options: service.get('options').sortBy(option => option.get('name')).reduce((opts, option) => {
        opts.push({
          label: option.get('name'),
          value: option.get('id'),
          requires_charge_number: option.get('requires_charge_number'),
          supports_regional_billing: option.get('supports_regional_billing')
        })
        return opts
      }, [])
    })

    return acc
  }, [])
}

/***
 * Get common regions for all services
 * @param  {} state from redux
 * @return []
 */
export const getRegionsInfo = (state) => {
  return state.serviceInfo.regions.reduce((acc, region) => {
    acc.push(region.toJS())

    return acc
  }, [])
}

/* HELPERS */
export const getProviderTypeName = (providerTypes, id) => {
  if (!id) {return;}

  const providerType = providerTypes.find(item => item.get('id') === id)

  if (providerType) {return providerType.get('name')}

  return 'N/A'
}

export const getServiceName = (services, id) => {
  const service = services.get(String(id))

  if (service) {return service.get('name')}

  return "N/A"
}

export const getOptionName = (services, serviceId, optionId) => {
  const service = services.get(String(serviceId))
  let optionName = "N/A"

  if (service) {
    const option = service.get('options').find(item => item.get('id') === optionId)
    if (option) {optionName = option.get('name')}
  }

  return optionName
}
