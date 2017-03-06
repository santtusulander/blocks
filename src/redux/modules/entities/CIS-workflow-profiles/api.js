import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_NORTH } from '../../../util'

const baseUrl = (workflow = 'abr') => {
  return `${BASE_URL_CIS_NORTH}/workflows/${workflow}/profiles`
}

const profileSchema = new schema.Entity('workflowProfiles')

/**
 * Fetch list of workflowProfiles
 * @return {[type]}         [description]
 */
export const fetchAll = ({}) => {
  return axios.get(baseUrl())
    .then( ({data}) => {
      return normalize(data, [ profileSchema ])
    })
}
