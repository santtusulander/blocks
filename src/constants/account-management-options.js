export const ACCOUNT_TYPES = [
  { value: 1, label: 'Content Provider' },
  { value: 2, label: 'Service Provider' },
  { value: 3, label: 'Cloud Provider' }
]

export const SERVICE_TYPES = [
  { value: 0, label: 'UDN Network Partner - On-Net', accountType: 2 },
  { value: 1, label: 'Media Delivery', accountType: 1 }
  // Not in 0.7 { value: 'storage', label: 'Storage', accountType: 3 }
]

export const BRANDS = [
  { id: 'udn', brandName: 'UDN' }
]
