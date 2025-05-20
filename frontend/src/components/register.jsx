import { isVisible } from '@testing-library/user-event/dist/utils';
import NoWorkResult from 'postcss/lib/no-work-result';
import { useState, useRef, useEffect, useCallback } from 'react';
import { API } from '../utils/backPaths';
import Message from '../utils/message';
import validationAccount from '../utils/validationAccount';
import { modal } from './dialog';
import { useRegisterValidation } from './validationForm';
import ValidationInput from './validationInput';


export default function Register({ vReg, setVreg }) {
  const divRef = useRef(null)
  const [message, setMessage] = useState({ 'message': null, 'error': false })

  useEffect(() => {
    modal(vReg, setVreg, divRef, false)
  }, [vReg])


  const execRegister = async () => {
    try {
      if (isValid) {
        const payload = {
          'user': values.user,
          'email': values.email,
          'password': values.password
        }
        await fetchToRegister(payload, setValidation, setMessage)
      }
    } catch (error) {
      setMessage({ message: 'Error al hacer la peticion', error: true })
    }
  }



  useEffect(() => {
    //limpiar form al hacerlo visible
    setValidation({ 'user': null, 'password': null, 'email': null })
    setMessage({ message: null, error: null })
  }, [vReg])

  const { values, setValues, validation, setValidation, isValid } = validationAccount({ 'user': null, 'password': null, 'email': null }, { user: true, password: true, email: true })

  if (!vReg) return
  return (
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={divRef}
        class="rounded-md gap-3 flex flex-col p-6 bg-[#F1F1F1] w-full max-w-[400px] mx-auto"
      >
        <Message message={message.message} error={message.error}></Message>
        <form onSubmit={(e)=>{e.preventDefault();execRegister()}}>
          <ValidationInput
            placeholder="Ingrese el usuario"
            type="text"
            onChange={(val) => {
              setValues((prev) => ({ ...prev, user: val }))
            }}
            error={validation.user}>
          </ValidationInput>
          <ValidationInput
            type="password"
            placeholder="ingrese la contraseña"
            onChange={(val) => {
              setValues((prev) => ({ ...prev, password: val }))
            }}
            error={validation.password}>
          </ValidationInput>
          <ValidationInput
            placeholder="ingrese el email"
            type="email"
            onChange={(val) => {
              setValues((prev) => ({ ...prev, email: val }))
            }}
            error={validation.email}>
          </ValidationInput>

          <input class="bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 hover:cursor-pointer disabled:bg-gray-500 disabled:hover:cursor-default w-full"
            disabled={!isValid}
            type="submit"
            value="Registrarme"
          />
        </form>
      </div>
    </div>
  )
}

const fetchToRegister = async (payload, setValidation, setMessage) => {
  const response = await fetch(`${API}/api/accountManager/register`, {
    method: "POST",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify(payload)
  })

  const data = await response.json();
  if (!response.ok) {
    if (data.errorCode === 1000) {
      setValidation(prev => ({ ...prev, user: data.error }));
    }
    if (data.errorCode === 1001) {
      setValidation(prev => ({ ...prev, password: data.error }));
    }
    if (data.errorCode === 1002) {
      setValidation(prev => ({ ...prev, email: data.error }));
    }
    if (!data.errorCode) {
      setMessage((prev) => ({ ...prev, message: data.error, error: true }))
    }
  } else {
    setMessage((prev) => ({ ...prev, message: data.successfully, error: false }))
  }
}
