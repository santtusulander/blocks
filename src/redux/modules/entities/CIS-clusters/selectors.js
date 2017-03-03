import {getEntityById} from '../../entity/selectors'

/**
 * Get Cluster by ID
 * @param  {} state from redux
 * @param  String id of the item
 * @return {} Map
 */
export const getById = (state, id) => {
  return getEntityById(state, 'CISClusters', id)
}

/**
 * Get list of Clusters
 * @param  {} state
 * @param  {String} brand [description]
 * @return List
 */
export const getAll = (state) => {
  return state.entities.CISClusters.toList()
}

/***
 * Get Locations options for MultiOptionSelector
 *
 * @param  {} state from redux
 *
 * @return []
 */
export const getLocationOptions = (state) => {
  let locationOptions = []

  state.entities.CISClusters.forEach((cluster) => {
    locationOptions.push({
      label: cluster.get('description'),
      value: cluster.get('geolocation'),
      options: []
    })
  })

  return locationOptions
}

/***
 * Get selected locations options for MultiOptionSelector
 *
 * @param {} state from redux
 * @param [] List of clusters
 *
 * @return []
 */
export const getSelectedLocationOptions = (state, clusters) => {
  let locationOptions = []

  clusters.forEach((cluster) => {
    const clusterInfo = getById(state, cluster)
    if (clusterInfo) {
      locationOptions.push({
        id: clusterInfo.get('geolocation'),
        options: []
      })
    }
  })

  return locationOptions
}

/***
 * Get cluster by location
 *
 * @param {} state from redux
 * @param [] Array of objects
 *
 * @return []
 */
export const getClustersByLocations = (state, locations) => {
  let selectedClusters = []

  locations.forEach((location) => {
    state.entities.CISClusters.forEach((cluster) => {
      if (cluster.get('geolocation') === location.id) {
        selectedClusters.push(cluster.get('name'))
      }
    })
  })

  return selectedClusters
}
