/**
 * Pagination (location) changed?
 * @param  {Object} location     usually this.props.location
 * @param  {Object} nextLocation usually nextProps.location
 * @return {Bool}
 */
export const paginationChanged = (location, nextLocation) => {
  const {page, sortBy, sortOrder, filterBy, filterValue} = nextLocation.query

  return (
    page !== location.query.page
    || sortBy !== location.query.sortBy
    || sortOrder !== location.query.sortOrder
    || filterBy !== location.query.filterBy
    || filterValue !== location.query.filterValue
  )
}
