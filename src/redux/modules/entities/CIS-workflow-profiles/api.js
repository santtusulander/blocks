/*TODO: UDNP-2837 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH } from '../../../util'

const baseUrl = (workflow = 'abr') => {
  return `${BASE_URL_CIS_SOUTH}/workflows/${workflow}/profiles`
}

const profileSchema = new schema.Entity('workflowProfiles')

const mockData = [
    {"id": "abr_tv_16_9_high", "label": "ABR dynamic packager - Smart TV - 16x9, high bitrate", "tags": ["abr", "tv", "16x9", "high"]},
    {"id": "abr_pc_16_9_mid", "label": "ABR dynamic packager - PC Player - 16x9, middle bitrate", "tags": ["abr", "pc", "16x9", "middle"]},
    {"id": "abr_mobile_16_9_low", "label": "ABR dynamic packager - Mobile Player - 16x9, low bitrate", "tags": ["abr", "mobile", "16x9", "low"]},
    {"id": "abr_tablet_4_3_high", "label": "ABR dynamic packager - Tablet Player - 4x3, high bitrate", "tags": ["abr", "mobile", "4x3", "high"]},
    {"id": "abr_sd_4_3_low", "label": "ABR dynamic packager - SD - 4x3, low bitrate", "tags": ["abr", "tv", "4x3", "low"]}
]

/**
 * Fetch list of workflowProfiles
 * @return {[type]}         [description]
 */
export const fetchAll = ({}) => {
  return Promise.resolve( normalize(mockData, [ profileSchema ]) )

  //TODO: UDNP-2873 Uncomment when API is fixed
  // return axios.get(baseUrl())
  //   .then( ({data}) => {
  //     return normalize(data, [ profileSchema ])
  //   })
}
