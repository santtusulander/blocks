export const ACCOUNT_TYPE_CONTENT_PROVIDER = 1;
export const ACCOUNT_TYPE_SERVICE_PROVIDER = 2;
export const ACCOUNT_TYPE_CLOUD_PROVIDER = 3;

export const ACCOUNT_TYPES = [
  { value: ACCOUNT_TYPE_CONTENT_PROVIDER, label: 'Content Provider' },
  { value: ACCOUNT_TYPE_SERVICE_PROVIDER, label: 'Service Provider' },
  { value: ACCOUNT_TYPE_CLOUD_PROVIDER,   label: 'Cloud Provider' }
]

export const SERVICE_TYPES = [
  { value: 101, label: 'UDN Network Partner - On-Net', accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { value: 1, label: 'Media Delivery', accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: ACCOUNT_TYPE_CLOUD_PROVIDER }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]

export const ROLES_MAPPING = [
  { id: 1, accountTypes: [ACCOUNT_TYPE_CLOUD_PROVIDER] },
  { id: 2, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: 3, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] },
  { id: 4, accountTypes: [ACCOUNT_TYPE_CONTENT_PROVIDER] },
  { id: 5, accountTypes: [ACCOUNT_TYPE_SERVICE_PROVIDER] }
]

export const NAME_VALIDATION_REGEXP = '^[a-zA-Z0-9_ \\.,\\-\\&\\(\\)\[\\]]{3,40}$'