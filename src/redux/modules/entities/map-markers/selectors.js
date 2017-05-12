
import {List} from 'immutable'

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

  //get nodes that match with the iata_code
  const nodes = state.dashboard.getIn(['dashboard', 'all_sp_providers', 'rawDetails'], List())
    .filter(node => {
      return node.get('asset').match(new RegExp(`[.-]${location.get('iata_code')}[0-9]*[.-]`, "i"))

    })

  const total = nodes.reduce((mem, val) => {
    mem += val.getIn(['http', 'net_off_bytes'],0)
    mem += val.getIn(['https', 'net_on_bytes'],0)
    mem += val.getIn(['http', 'net_off_bytes'],0)
    mem += val.getIn(['https', 'net_on_bytes'],0)

    return mem
  }, 0)

  return total
}
