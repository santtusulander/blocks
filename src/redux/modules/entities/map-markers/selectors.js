/**
 * Get list of Markers
 * @param  {} state
 * @return List
 */
export const getAll = (state) => {
  return state.entities.mapMarkers.toList()
}
