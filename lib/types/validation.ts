
export interface Validation {
  $invalid: boolean
  required?: { $invalid: boolean }
  maxSize?: { $invalid: boolean }
  fileType?: { $invalid: boolean }
  errors?: { $invalid: boolean }
  minlength?: { $invalid: boolean }
  maxlength?: { $invalid: boolean }
  minLength?: { $invalid: boolean }
  maxValue?: { $invalid: boolean }
  minValue?: { $invalid: boolean }
  exactLength?: { $invalid: boolean }
  email?: { $invalid: boolean }
  url?: { $invalid: boolean }
  maxFractionDigits?: { $invalid: boolean }
}
