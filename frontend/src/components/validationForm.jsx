import { useEffect, useState } from "react";


function useDebounceEffect(callback, delay, deps) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}
export function useRegisterValidation(register, validation, setValidation) {
  //const [validator, setValidator] = useState(validation);
  useDebounceEffect(() => {
    //useEffect(() => {
    const emailRegex = /^[\w\.-]+@[\w\.-]+$/;
    setValidation({
      user:
        register?.user?.length < 4
          ? 'El usuario debe tener al menos 4 caracteres'
          : register?.user?.length > 18
            ? 'El usuario debe tener menos de 18 caracteres'
            : null,
      password:
        register?.password?.length < 4
          ? 'La contraseña debe tener al menos 4 caracteres'
          : register?.password?.length > 18
            ? 'La contraseña debe tener menos de 18 caracteres'
            : null,
      email:
        register?.email?.length < 4
          ? emailRegex.test(register.email)
            ? null
            : 'El email es obligatorio'
          : null
      //: !emailRegex.test(register.email)
      //  ? 'Email inválido'
      //  : null,
    });
  }, 500, [register])
}
