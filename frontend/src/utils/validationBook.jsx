import { useState, useEffect } from "react";

function useDebounceEffect(callback, delay, deps) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

function validTitle(title) {
  return !title ? null :
    title.length < 4 ? "El nombre debe tener al menos 4 caracteres" :
      title.length > 70 ? "El nombre debe tener menos de 70 caracteres" : null
}
function validDescription(description) {
  return !description ? null :
    description.length < 4 ? "La biografía debe tener al menos 4 caracteres" :
      description.length > 1200 ? "La biografía debe tener menos de 1200 caracteres" : null
}
function validPrice(price) {
  return !price ? null :
    price < 1 ? "El precio debe ser mayor a 0" :
      price > 9999999 ? "El precio debe ser menor a 9999999" : null
}
var dateMin = new Date("Jan 01, 1900");
function validDate(date) {
  return !date ? null :
    dateMin > date ? "Ingrese una fecha valida" : null

}

export default function(initialValues = {}, required = {}) {
  const [values, setValues] = useState(initialValues)
  const [validation, setValidation] = useState({})
  const [isValid, setIsValid] = useState(false)

  useDebounceEffect(() => {

    console.log(values)
    const newValidation = {}

    if ('title' in values) {
      newValidation.title = validTitle(values.title)
    }
    if ('description' in values) {
      newValidation.description = validDescription(values.description)
    }
    if ('date' in values) {
      newValidation.date = validDate(values.date)
    }
    if ('price' in values) {
      newValidation.price = validPrice(values.price)
    }
    const titleIsValid = !required.title || validTitle(values.title) === null && values.title !== null;
    const descriptionIsValid = !required.description || validDescription(values.description) === null && values.description !== null
    const dateIsValid = !required.date || validDate(values.date) === null && values.date !== null
    const priceIsValid = !required.price || validDate(values.price) === null && values.price !== null

    const allValid = titleIsValid && descriptionIsValid && dateIsValid && priceIsValid;
    setIsValid(allValid)

    setValidation(newValidation)
  }, 0, [values])

  useEffect(() => {
    console.log(isValid)
  }, [isValid])
  return {
    values,
    setValues,
    validation,
    setValidation,
    setIsValid,
    isValid
  }
}

