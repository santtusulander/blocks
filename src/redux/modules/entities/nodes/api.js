import { normalize } from 'normalizr'
import { Schemas } from '../schemas'

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

export const fetch = () => Promise.resolve(normalize(mockNodeList, Schemas.node))
