export const ACCOUNT_TYPES = [
  { value: 1, label: 'Content Provider' },
  { value: 2, label: 'Service Provider' },
  { value: 3, label: 'Cloud Provider' }
]

export const SERVICE_TYPES = [
  { value: 2, label: 'UDN Network Partner - On-Net', accountTypes: [2] }, // TODO: Update the value when the service is implemented
  { value: 1, label: 'Media Delivery', accountTypes: [1] }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]

export const ROLES_MAPPING = [
  { id: 1, accountTypes: [3] },
  { id: 2, accountTypes: [1] },
  { id: 3, accountTypes: [2] }
]

export const NAME_VALIDATION_REGEXP = '^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$'
