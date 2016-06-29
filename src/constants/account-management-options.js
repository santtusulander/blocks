export const ACCOUNT_TYPES = [
  { value: 3, label: 'Content Provider' },
  { value: 1, label: 'Service Provider' }
]

export const SERVICE_TYPES = [
  { value: 0, label: 'UDN Network Partner - On-Net', accountType: 1 },
  { value: 1, label: 'Media Delivery', accountType: 3 }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]
