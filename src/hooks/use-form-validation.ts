/* eslint-disable prefer-const */
import { useState } from 'react'

type Rule = (value: string) => string | null
type Rules<T> = Partial<Record<keyof T, Rule[]>>

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T> = {}
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>(
    {}
  )

  const validateField = (name: keyof T, value: string) => {
    const fieldRules = rules[name] || []
    for (let rule of fieldRules) {
      const err = rule(value)
      if (err) {
        setErrors((prev) => ({ ...prev, [name]: err }))
        return false
      }
    }
    setErrors((prev) => ({ ...prev, [name]: null }))
    return true
  }

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (rules[name]) validateField(name, value)
  }

  const validateForm = () => {
    let valid = true
    for (const key in rules) {
      const value = values[key]
      if (!validateField(key, value)) {
        valid = false
      }
    }
    return valid
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, handleChange, validateForm, resetForm, setValues }
}

export const required =
  (msg = 'This field is required') =>
  (v: string) =>
    !v.trim() ? msg : null

export const minLength = (len: number, msg?: string) => (v: string) =>
  v.trim().length < len ? msg || `Min length is ${len}` : null

export const isEmail =
  (msg = 'Invalid email') =>
  (v: string) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : null
