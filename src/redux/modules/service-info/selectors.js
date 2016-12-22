/**
 * Get list of servives
 * @param  {} redux state state
 * @return {Map}       services
 */
export const getServices = (state) => {
  return state.serviceInfo.services
}

/**
 * Get list of providerTypes
 * @param  {} redux state state
 * @return {Map}       services
 */
export const getProviderTypes = (state) => {
  return state.serviceInfo.providerTypes
}

/***
 * Get service by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {Map} service
 */
export const getServiceById = (state, id) => {
  return state.serviceInfo.servicea.get(String(id))
}

/***
 * Get Provider Types for dropdown
 * @param  {} state from redux
 * @return []
 */
export const getProviderTypeOptions = (state) => {
  return state.serviceInfo.providerTypes.reduce( (acc, type) => {
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
  if (!providerType || providerType === "") return

  const providerServices = state.serviceInfo.providerTypes.getIn([String(providerType), 'services'])

  return providerServices && providerServices.reduce( (acc, serviceId) => {
    const service = state.serviceInfo.services.get(String(serviceId))

    acc.push({
      label: service.get('name'),
      value: service.get('id'),
      options: service.get('options').reduce( (opts, option) => {
        opts.push({
          label: option.get('name'),
          value: option.get('id')
        })
        return opts
      }, [])
    })

    return acc
  }, [])
}
