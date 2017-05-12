/**
 * Get list of Markers
 * @param  {} state
 * @return List
 */
export const getAll = (state) => {
  return state.entities.mapMarkers.toList()
}

export const getAllWithTraffic = (state) => {
  const locations = getAll(state)

  //find traffic data for a location
  return locations.map(location => {
    const traffic = getLocationTraffic(state, location)

    return location.merge({traffic})
  })
}

export const getLocationTraffic = (state, location) => {

  //cores need to be fetched by 'asset' - as key
  if (location.get('type') === 'core') {

  } else {

  }
  
  return state
}
