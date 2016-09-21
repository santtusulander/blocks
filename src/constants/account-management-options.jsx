export const ACCOUNT_TYPES = [
  { value: 1, label: 'Content Provider' },
  { value: 2, label: 'Service Provider' },
  { value: 3, label: 'Cloud Provider' }
]

export const FILTERED_ACCOUNT_TYPES = ACCOUNT_TYPES.filter(type => type.value !== 3)

export const ACCOUNT_TYPE_OPTIONS = FILTERED_ACCOUNT_TYPES.map(e => {
  return [e.value, e.label]
});

export const SERVICE_TYPES = [
  { value: 101, label: 'UDN Network Partner - On-Net', accountTypes: [2] },
  { value: 1, label: 'Media Delivery', accountTypes: [1] }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]

export const BRAND_OPTIONS = BRANDS.map(e => {
  return [e.id, e.brandName]
});

export const ROLES_MAPPING = [
  { id: 1, accountTypes: [3] },
  { id: 2, accountTypes: [1] },
  { id: 3, accountTypes: [2] },
  { id: 4, accountTypes: [1] },
  { id: 5, accountTypes: [2] }
]

export const NAME_VALIDATION_REGEXP = '^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$'
