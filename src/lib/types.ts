export interface FormData {
  model: string
  color: string
  externalOptions: string[]
  manufacturerOptions: string[]
  vanariOptions: string[]
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    postalCode: string
  }
}



export interface StepProps {
  formData: FormData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFormData: (field: keyof FormData, value: any) => void
}
