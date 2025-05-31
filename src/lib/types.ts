// src/lib/types.ts

export interface StepProps {
  formData: FormData
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void
  colors?: Color[]
}

export interface OrderData {
  id: number
  uniq_id?: string
  vehicle_model_id: number
  theme_id: number
  customer_info_id?: number
  base_price: string
  total_price: string
  status?: string
  created_at?: string
  updated_at?: string
  
  // Nested objects
  vehicle_model?: VehicleModel
  colors?: Color[]
  theme?: Theme
  additional_options?: AdditionalOption[]
}

export interface AdditionalOption {
  id: number
  name: string
  price: string
  type: "Manufacturer Options" | "Vanari Options"
  // Add other properties as needed
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
  category_id: number | string
  base_price: string
  price: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category?: any
  status?: string
  created_at?: string
  updated_at?: string
}


export interface Color {
  id: number
  name: string
  code: string | null
  image: string | null
  status: string
  themeId: number | null
  themeName: string | null
  created_at: string
  updated_at: string
  

}


export interface ColorSelectionData {
  color1: Color | null
  color2: Color | null
  themeId: number | null
  themeName: string | null
  selectedTheme?: Theme
  status?: string
}
export interface FormData {
  model: string
  modelData: VehicleModel | null
  color: ColorSelectionData | null
  externalOptions: Record<string, unknown>
  manufacturerOptions: Record<string, unknown>
  vanariOptions: Record<string, unknown>
  selectedTheme: Theme | null
  
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

export interface OrderResponse {
  id?: number
  vehicle_model_id?: number
  color_1_id?: number
  color_2_id?: number
  theme_id?: number
  data?: {
    uniq_id?: string
  }
  uniq_id?: string // direct property alternative
}


export interface ModelColorWiseImage {
  id: number
  vehicle_model_id: number
  color_1_id: number
  color_2_id: number
  image: string
  image2?: string
  created_at: string
  updated_at: string
  vehicle_model: {
    id: number
    name: string
  }
  color1: {
    id: number
    name: string
  }
  color2: {
    id: number
    name: string
  }
}


