export const ACCOUNT_TYPES = [
  { value: 1, label: 'Content Provider' },
  { value: 3, label: 'Service Provider' }
]

export const SERVICE_TYPES = [
  { value: 0, label: 'UDN Network Partner - On-Net', accountTypes: [3] },
  { value: 1, label: 'Media Delivery', accountTypes: [1, 3] }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]
