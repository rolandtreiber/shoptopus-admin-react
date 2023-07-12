import {useEffect, useState} from 'react'

export const useNestedValidation = () => {
  const [validations, setValidations] = useState({})
  const [isValid, setIsValid] = useState(true)

  const setValidation = (field) => {
    setValidations({...validations, ...field})
  }

  const clearValidations = () => {
    setValidations({})
  }

  useEffect(() => {
    setIsValid(!Object.keys(validations).find(v => validations[v] === false))
  }, [validations])

  return {
    validations,
    setValidations,
    setValidation,
    clearValidations,
    isValid
  }
}