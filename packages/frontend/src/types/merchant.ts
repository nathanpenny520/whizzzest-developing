export interface IMerchant {
  id: string
  userId: string
  name: string
  category: string
  mapLng: number
  mapLat: number
  isVerified: boolean
  coverImage?: string
  businessHours?: string
  phone?: string
  description?: string
  createdAt: Date
}
