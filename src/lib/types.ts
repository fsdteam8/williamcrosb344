export interface StepProps {
  formData: any
  updateFormData: (field: string, value: any) => void
  colors?: any[]
}

export interface ModelCategory {
  id: number
  name: string
  vehicle_models: {
    id: number
    category_id: number
    name: string
  }[]
}

export interface VehicleModel {
  id: number
  name: string
  sleep_person: string
  description: string
  inner_image: string
  outer_image?: string | null
  category_id: number
  base_price: string
  price: string
  category?: {
    id: number
    name: string
  }
}

export interface Color {
  id: number
  name: string
  code: string | null
  image: string | null
  status: string
}

export interface FormData {
  model: string
  modelData: VehicleModel | null
  color: any
  externalOptions: any
  manufacturerOptions: any
  vanariOptions: any
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    postalCode: string
  }
}

export interface Theme {
  id: number
  name: string
  image: string
  flooring_name: string
  flooring_image: string
  cabinetry_1_name: string
  cabinetry_1_image: string
  table_top_1_name: string
  table_top_1_image: string
  seating_1_name: string
  seating_1_image: string
  seating_2_name: string
  seating_2_image: string
  cabinetry_2_name: string
  cabinetry_2_image: string
  table_top_2_name: string
  table_top_2_image: string
  created_at: string
  updated_at: string
}

export interface ThemeWiseImage {
  id: number
  vehicle_model_id: number
  theme_id: number
  image: string
  created_at: string
  updated_at: string
  vehicle_model: {
    id: number
    name: string
  }
  theme: {
    id: number
    name: string
  }
}

interface ColorSelectionData {
  themeId?: number
  themeName?: string
  themeImage?: string
  selectedTheme?: Theme
}




