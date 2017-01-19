import { normalize, schema } from 'normalizr'
import axios from 'axios'

import { BASE_URL_AAA } from '../../../util'

const mockNodeList = [
  {
    "account_id": 1,
    "brand_id": "udn",
    "cloud_driver": 6,
    "created": 1474291378,
    "custom_grains": [],
    "env": "cdx-dev",
    "group_id": 10,
    "id": "test.xxx.neppari",
    "name": "test.xxx.neppari",
    "network_id": "udn",
    "pod_id": "pod10",
    "pop_id": "par",
    "roles": [
      "cache"
    ],
    "status": 1,
    "type": 1,
    "updated": 1474291378
  },
  {
    "account_id": 1,
    "brand_id": "udn",
    "cloud_driver": 6,
    "created": 1474291378,
    "custom_grains": [],
    "env": "cdx-dev",
    "group_id": 10,
    "id": "sp-edge10.sfo.cdx-dev",
    "name": "sp-edge10.sfo.cdx-dev",
    "network_id": "udn",
    "pod_id": "pod10",
    "pop_id": "par",
    "roles": [
      "cache"
    ],
    "status": 1,
    "type": 1,
    "updated": 1474291378
  },
  {
    "account_id": 1,
    "brand_id": "udn",
    "cloud_driver": 6,
    "created": 1474291378,
    "custom_grains": [],
    "env": "cdx-dev",
    "group_id": 10,
    "id": "testingen.automatium",
    "name": "testingen.automatium",
    "network_id": "udn",
    "pod_id": "pod10",
    "pop_id": "par",
    "roles": [
      "cache"
    ],
    "status": 1,
    "type": 1,
    "updated": 1474291378
  },
  {
    "account_id": 1,
    "brand_id": "udn",
    "cloud_driver": 6,
    "created": 1474291378,
    "custom_grains": [],
    "env": "cdx-dev",
    "group_id": 10,
    "id": "sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net",
    "name": "sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net",
    "network_id": "udn",
    "pod_id": "pod10",
    "pop_id": "par",
    "roles": [
      "cache"
    ],
    "status": 1,
    "type": 1,
    "updated": 1474291378
  }
]

const mockNodeIdList = [
  "test.xxx.neppari",
  "sp-edge10.sfo.cdx-dev",
  "testingen.automatium",
  "sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net"
]

const mockNodeToCreate = {
  "account_id": 1,
  "brand_id": "udn",
  "cloud_driver": 6,
  "created": 1474291378,
  "custom_grains": [],
  "env": "cdx-dev",
  "group_id": 10,
  "id": "to.create",
  "name": "to.create",
  "network_id": "udn",
  "pod_id": "pod10",
  "pop_id": "par",
  "roles": [
    "cache"
  ],
  "status": 1,
  "type": 1,
  "updated": 1474291378
}

const baseURL = ({ brand, account, group, pop }) =>
  `${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}/networks/${brand}/pops/${pop}/nodes`

const nodeSchema = new schema.Entity('nodes')

export const fetchAll = () => Promise.resolve(mockNodeIdList)
// export const fetchAll = (urlParams) =>
//   axios.get(baseURL(urlParams))
//     .then(data => {
//       console.log(data)
//       return data
//     })

export const fetch = ({ id }) =>
  Promise.resolve(normalize(mockNodeList.find((node) => node.id === id), nodeSchema))
// export const fetch = ({ id, ...baseUrlParams }) =>
//   axios.get(`${baseURL(baseUrlParams)}/${id}`)
//     .then(data => {
//       console.log(data)
//       return normalize(data, nodeSchema)
//     })


export const create = () => Promise.resolve(normalize(mockNodeToCreate, nodeSchema))
// export const create = ({ payload, ...urlParams }) =>
//   axios.post(baseURL(urlParams), payload)
//     .then(data => normalize(data, nodeSchema))

export const update = () => Promise.resolve(normalize(mockNodeList[0], nodeSchema))
// export const update = ({ id, payload, ...baseUrlParams }) =>
//   axios.put(`${baseURL(baseUrlParams)}/${id}`, payload)
//     .then(data => normalize(data, nodeSchema))

export const remove = () => Promise.resolve({ id: 'sp-edge10.sfo.cdx-dev.unifieddeliverynetwork.net' })
// export const remove = ({ id, ...baseUrlParams }) =>
//   axios.delete(`${baseURL(baseUrlParams)}/${id}`)
//     .then(() => { id })
