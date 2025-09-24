// Component Exports
export { default as AddressInputPanel } from './AddressInputPanel'

// Types
export interface AddressData {
  province: string
  district: string
  ward: string
}

export interface SyncResult {
  oldAddress: AddressData
  newAddress: AddressData
  syncStatus: 'success' | 'error'
  message: string
  timestamp: string
}

export interface DropdownOption {
  label: string
  value: string
}
