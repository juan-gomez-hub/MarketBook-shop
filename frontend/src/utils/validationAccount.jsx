import { useState, useEffect } from "react";

function useDebounceEffect(callback, delay, deps) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

function validEmail(email) {
  const emailRegex = /^[\w.-]+@[\w.-]+$/;
  return (!emailRegex.test(email))
    ? 'El correo no es válido'
    : null
}
function validUser(user) {

  return user?.length < 4
    ? 'Debe tener al menos 4 caracteres'
    : user?.length > 18
      ? 'Debe tener menos de 18 caracteres'
      : null
}

function validPassword(password) {
  return password?.length < 4
    ? 'Debe tener al menos 4 caracteres'
    : password?.length > 18
      ? 'Debe tener menos de 18 caracteres'
      : null
}
function validMatchPassword(passInput, pass) {
  return pass !== passInput
    ? 'Las contraseñas no coinciden'
    : null
}
export default function(initialValues = {}, required = {}) {
  const [values, setValues] = useState(initialValues)
  const [validation, setValidation] = useState({})
  const [isValid, setIsValid] = useState(false)

  useDebounceEffect(() => {

    console.log(values)
    const newValidation = {}

    if ('user' in values) {
      newValidation.user = validUser(values.user)
    }

    if ('password' in values) {
      newValidation.password = validPassword(values.password)
    }
    //el mail se verifica así para que funcione igual que los demas inputs
    if ('email' in values && values.email !== null) {
      newValidation.email = validEmail(values.email)
    }
    if ('matchPassword' in values && values.matchPassword) {
      newValidation.matchPassword = validMatchPassword(values.password, values.matchPassword)
    }


    const emailIsValid = !required.email || validEmail(values.email) === null &&values.email!==null;
    const userIsValid = !required.user || validUser(values.user) === null && values.user !== null;
    const passwordIsValid = !required.password || validPassword(values.password) === null && values.password !== null;
    const matchPasswordIsValid= !required.matchPassword || validMatchPassword(values.password,values.matchPassword)===null&&values.matchPassword!==null

    const allValid = emailIsValid && userIsValid && passwordIsValid && matchPasswordIsValid;
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
