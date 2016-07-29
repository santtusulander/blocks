export const ACCOUNT_TYPES = [
  { value: 1, label: 'Content Provider' },
  { value: 2, label: 'Service Provider' }
  //{ value: 3, label: 'Cloud Provider' }
]

export const SERVICE_TYPES = [
  { value: 2, label: 'UDN Network Partner - On-Net', accountTypes: [2] }, // TODO: Update the value when the service is implemented
  { value: 1, label: 'Media Delivery', accountTypes: [1] }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]

export const ROLES = [
  { id: 2, label: 'CP Admin', accountTypes: [1] },
  { id: 1, label: 'SP Admin', accountTypes: [2] },
  { id: 3, label: 'UDN Admin', accountTypes: [ 1, 2 ] }
]
