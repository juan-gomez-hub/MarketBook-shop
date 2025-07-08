import { useState, useEffect } from "react"
import ValidationInput from "./validationInput"
import { useAuth } from "./authProvider"
import validationAccount from "../utils/validationAccount"
import Message from "../utils/message"
import { API } from "../utils/backPaths"

async function fetchLogin(user, password, isValid) {
  if (!isValid) throw new Error("inputs invalidos")
  const response = await fetch(`${API}/api/accountManager/login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      'user': user,
      'password': password
    })
  })
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json()
}

const updateState = (setState, updates) => {
  setState(prevState => ({
    ...prevState,
    ...updates
  }));
};
async function handlerToResponse(data) {
  const errorMapping = {
    1000: 'user',
    1001: 'password',
    1002: 'email'
  };

  return errorMapping[data.errorCode] ? { [errorMapping[data.errorCode]]: data.error } : {};
}

export default function Login({ visibility, setVisibility, changeViewLogin }) {
  const [message, setMessage] = useState({ message: null, error: null })
  const { login } = useAuth()

  const execLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await fetchLogin(values.user, values.password, isValid);

      setVisibility(false);
      setMessage({ message: "Has iniciado sesión", error: false });
      login(data.success.token);

    } catch (error) {
      if (error.errorCode) {
        updateState(setValidation, await handlerToResponse(error));
      } else {
        setMessage({
          message: "Error al iniciar sesión",
          error: true
        });
      }
    }
  }

  useEffect(() => {
    setValues({ 'user': null, 'password': null })
    setMessage({ message: null, error: null })
  }, [visibility])


  const { values, setValues, validation, setValidation, isValid } = validationAccount({ 'user': null, 'password': null }, { user: true, password: true })
  return (
    <>
      <Message message={message.message} error={message.error}></Message>
      <form onSubmit={(e) => { execLogin(e) }}>
        <ValidationInput
          title="Nombre de usuario"
          placeholder="ingresar usuario o email"
          onChange={(val) => { setValues(prev => ({ ...prev, user: val })) }}
          error={validation.user}
        />
        <ValidationInput
          title="Contraseña"
          placeholder="Ingresar contraseña"
          type="password"
          onChange={(val) => { setValues(prev => ({ ...prev, password: val })) }}
          error={validation.password}
        />
        <div>
          <h1 href='' className='hover:cursor-pointer select-none text-purple-900 inline underline ' onClick={changeViewLogin}>olvidé mi contraseña</h1>
        </div>
        <input class="bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 hover:cursor-pointer w-full disabled:bg-gray-500 disabled:cursor-default"
          type="submit"
          disabled={!isValid}
          value="Iniciar sesión"
        >
        </input>
      </form>
    </>
  )
}
