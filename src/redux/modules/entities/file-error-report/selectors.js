import { getEntityMetrics } from '../../entity/selectors'

export const getFileErrorURLs = state => getEntityMetrics(state, 'fileErrorMetrics', 'url_details')
export const getFileErrorSummary = state => getEntityMetrics(state, 'fileErrorMetrics', 'num_errors')
