/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars*/
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH, buildReduxId } from '../../../util'

const mock = {
  "estimated_usage": 999999,
  "usage": 2932224,
  "clusters": ["strg0"],
  "workflow": {
    "profile": {"media": [{"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 1920, "iframe_interval": 48, "bitrate": 8000, "fps": 30, "height": 1080}, "output_filename": "1080_8000k.mp4", "format": "mp4"}, {"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 1920, "iframe_interval": 48, "bitrate": 6000, "fps": 30, "height": 1080}, "output_filename": "1080_6000k.mp4", "format": "mp4"}, {"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 1280, "iframe_interval": 48, "bitrate": 4000, "fps": 30, "height": 720}, "output_filename": "720_4000k.mp4", "format": "mp4"}, {"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 960, "iframe_interval": 48, "bitrate": 2500, "fps": 30, "height": 540}, "output_filename": "540_2500k.mp4", "format": "mp4"}, {"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 640, "iframe_interval": 48, "bitrate": 1200, "fps": 30, "height": 360}, "output_filename": "360_1200k.mp4", "format": "mp4"}, {"audio": {"channels": 2, "bitrate": 128, "sample_rate": 48000}, "video": {"width": 480, "iframe_interval": 48, "bitrate": 600, "fps": 30, "height": 270}, "output_filename": "270_600k.mp4", "format": "mp4"}], "fragment_duration": 6400, "output_filename": "manifest.ism", "format": "ism"},
    "profile_id": "abr_tv_16_9_high",
    "id": "abr"
  }
}

const mockArray = [
  {
    id: 'storage1',
    ...mock
  },
  {
    id: 'storage2',
    ...mock
  }
]


const baseUrl = ({ group, id }) => {
  return `${BASE_URL_CIS_SOUTH}/ingest_points/${id}?group_id=${group}`
}

/* We only need profile_id -> set entity name to workflowsDummy so workflow doesn't go into redux */
const workflowSchema = new schema.Entity('workflowsDummy', {},{
  idAttribute: 'profile_id'
})

const ingestPointSchema = new schema.Entity('ingestPoints', {
  workflow: workflowSchema
},{
  idAttribute: (ingestPoint, group) => buildReduxId(group.id, ingestPoint.id),
  processStrategy: (value, parent) => {
    return {
      ...value,
      parentId: parent.id
    }
  }
})

const groupIngestPoints = new schema.Entity('groupIngestPoints', {
  ingestPoints: [ingestPointSchema]
})

/**
 * Fetch single ingestPoint
 * @param  {String} group
 * @param  {String} id
 * @return {Object} normalizr ingestPoints
 */
export const fetch = ({id, ...params}) => {
  return Promise.resolve( normalize({ id: params.group, ingestPoints: [mock] }, groupIngestPoints) )

  // return axios.get(`${baseUrl(params)}/${id}`)
  //   .then( ({data}) => {
  //     return normalize({ id: params.group, ingestPoints: [ data ] }, groupIngestPoints)
  //   })
}

/**
 * Fetch list of ingestPoints (storage)
 * @param  {Object} params {group}
 * @return {Object} normalizr ingestPoints
 */
export const fetchAll = ( params = {}) => {
  return Promise.resolve( normalize({ id: params.group, ingestPoints: mockArray }, groupIngestPoints) )

  // return axios.get(baseUrl(params))
  //   .then( ({data}) => {
  //     return normalize({ id: params.group, ingestPoints: [ data ] }, [ingestPointSchema])
  //   })
}

/**
 * Create an ingestPoint
 * @param  {[type]} group
 * @return {[type]} normalizr ingestPoint
 */
export const create = ({ payload, ...params }) => {
  return Promise.resolve( normalize({ id: params.group, ingestPoints: [mock] }, groupIngestPoints) )

  // return axios.post(baseUrl(params), payload, { headers: { 'Content-Type': 'application/json' } })
  //   .then(({ data }) => {
  //     return normalize({ id: params.group, ingestPoints: [ mock ] }, groupIngestPoints)
  //   })
}


/**
 * Update an ingestPoint
 * @param  {[type]} id            [description]
 * @param  {[type]} payload       [description]
 * @param  {[type]} params [description]
 * @return {[type]}               [description]
 */
export const update = ({ id, payload, ...params }) => {

  return Promise.resolve( normalize({ id: params.group, ingestPoints: [mock] }, groupIngestPoints) )

  // return axios.put(`${baseUrl(params)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
  //   .then(({ data }) => {
  //     return normalize({ id: params.group, ingestPoints: [ mock ] }, groupIngestPoints)
  //   })
}

/**
 * Update an ingestPoint
 * @param  {[type]} id            [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const remove = ({ id, ...params }) => {
  return Promise.resolve( normalize({ id: params.group, ingestPoints: [mock] }, groupIngestPoints) )

  // return axios.delete(`${baseUrl(params)}/${id}`)
  //   .then(() => ({ id: buildReduxId(params.group, id) }))
}
