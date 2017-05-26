import { getEntityById } from '../../entity/selectors'

export const getFileErrorURLs = state => getEntityById(state, 'fileErrorMetrics', 'url_details')
export const getFileErrorSummary = state => getEntityById(state, 'fileErrorMetrics', 'num_errors')
