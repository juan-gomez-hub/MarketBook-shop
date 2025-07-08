import { useState, useEffect } from "react";
import { API } from "../utils/backPaths";
import message from "../utils/message";
import Message from "../utils/message";
import validationAccount from "../utils/validationAccount";
import ValidationInput from "./validationInput"

async function fetchSendCode(email) {
  try {
    const response = await fetch(`${API}/api/accountManager/forgotAccount/sendCode`,
      {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ "email": email })
      }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}
async function fetchChangePass(email, code, newPass) {
  try {
    const response = await fetch(`${API}/api/accountManager/forgotAccount/changePass`,
      {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ "email": email, "code": code, "password": newPass })
      }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}

export default function() {

  const [codeSended, setCodeSended] = useState(false)
  const [codeInput, setCodeInput] = useState(null)
  const { values, setValues, validation, setValidation, setIsValid, isValid } = validationAccount({ email: null }, { email: true })
  const [message,setMessage]=useState({message:null,error:null})
  const getCode = async (email) => {
    const result = await fetchSendCode(email)
    if (!result.ok) {
      const json = await result.json()
      if (json.errorCode == 1002) {
        setIsValid(false)
        setValidation({ email: 'El mail ingresado no existe en el sistema' })
      }
    } else {
      setCodeSended(true)
    }
  }
  const changePass = async (code, password, email) => {
    const result = await fetchChangePass(email, code, password)
    if(!result.ok){
      const json=await result.json()
      if(json.errorCode==1003){
        setIsValid1(false)
        setValidation1({code:json.error})
      }else{
        setMessage({message:"Ha ocurrido un error",error:true})
      }
    }else{
     setMessage({message:"La contraseña ha sido cambiada exitosamente",error:false}) 
    }
  }

  const { values: values1, setValues: setValues1, validation: validation1, setValidation: setValidation1, isValid: isValid1,setIsValid:setIsValid1 } = validationAccount({ password: null, matchPassword: null,code:null }, { password: true, matchPassword: true,code:true })
  if (codeSended) {
    return (
      <>
        <form onSubmit={(e) => { e.preventDefault(); changePass(values1.code, values1.password, values.email) }}>
          <Message message={message.message} error={message.error}/>
          <h1>Hemos enviado el codigo de recuperación a tu correo</h1>
          <ValidationInput
            placeholder="ingrese la contraseña"
            type="password"
            onChange={(val) => {
              setValues1((prev) => ({ ...prev, password: val }))
            }}
            error={validation1.password} />
          <ValidationInput
            placeholder="repetir contraseña"
            type="password"
            onChange={(val) => {
              setValues1((prev) => ({ ...prev, matchPassword: val }))
            }}
            error={validation1.matchPassword} />
          <ValidationInput
            placeholder="ingrese el codigo"
            type="number"
            onChange={(val) => {
              setValues1((prev) => ({ ...prev, code: parseInt(val) }))
            }}
            error={validation1.code}
          />
          <input class="bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 hover:cursor-pointer w-full disabled:bg-gray-500 disabled:hover:cursor-default"
            type="submit"
            value="Continuar"
            disabled={!isValid1}
          />
        </form>
      </>
    )
  }
  else {
    return (
      <>
        <form onSubmit={(e) => { e.preventDefault(); getCode(values.email) }}>
          <ValidationInput
            placeholder="ingrese el email"
            type="email"
            onChange={(val) => {
              setValues((prev) => ({ ...prev, email: val }))
            }}
            error={validation.email} />
          <input class="bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 hover:cursor-pointer w-full disabled:bg-gray-500 disabled:hover:cursor-default"
            type="submit"
            value="Recuperar contraseña"
            disabled={!isValid}
          />
        </form>
      </>
    )
  }
}
