import { useEffect, useState } from "react"
import ModalCustom from "../utils/ui/customModal"
import Login from "../components/Login"
import RecoveryPassword from "../components/recoveryPassword"

export default function({vLogin,setVlogin}) {
  useEffect(()=>{setViewLogin(true)},[vLogin])
  const [viewLogin, setViewLogin] = useState(true)

  useEffect(() => { console.log(viewLogin) }, [viewLogin])
  if (viewLogin) {
    return (
      <ModalCustom
        visibility={vLogin}
        setVisibility={setVlogin}
      >
        <Login visibility={vLogin} setVisibility={setVlogin} changeViewLogin={() => setViewLogin(false)} ></Login>
      </ModalCustom>
    )
  }

  else {
    return (

      <ModalCustom
        visibility={vLogin}
        setVisibility={setVlogin}
      >
        <RecoveryPassword changeViewLogin={() => { setViewLogin(true) }} />
      </ModalCustom>
    )
  }
}
