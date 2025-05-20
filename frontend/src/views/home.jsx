import { useState, useEffect, useRef } from "react";
import Market from "../components/market";
import { Outlet } from "react-router-dom";
import Register from "../components/register";
import { modal } from "../components/dialog";
import Login from "../components/Login";
import { jwtDecode } from "jwt-decode";
import { Cookies, useCookies } from "react-cookie"
import { useAuth } from "../components/authProvider";
import HandlerViewLogin from "./handlerViewLogin";
export default function Home() {
  const [vReg, setVreg] = useState(false)
  const [vLogin, setVlogin] = useState(false)

  //const [userInfo, setUserInfo] = useState({ username: null, rol: null })

  const { userData, user, userRole, logout, isLogged, isLoading, image, payload } = useAuth()
  useEffect(() => {
    setTimeout(() => {
      console.log(payload)
    }, 5000)
    //console.log(user)
  }, [])
  const classInput = "text-md text-gray-900 hover:text-gray-600 hover:cursor-pointer select-none"
  return (
    <div className="h-screen max-w-full flex flex-col">

      {/*<header class="bg-[#C8A67C] p-2  m-auto w-full px-6 z-10 text-[#A8A29E]">*/}
      <header class="bg-gray-300">
        {
          <div class="m-auto w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[162px_minmax(340px,588px)_minmax(350px,390px)] gap-x-2 text-center p-2">
            {/*<div class="  m-auto w-fit grid grid-cols-[162px_minmax(340px,588px)_minmax(350px,390px)]  gap-x-2 text-center p-2 ">*/}
            <div class="w-full">
              <img className="width-fit" src="" alt="ICONO" class="h-10" />
            </div>
            <div class="flex-1 content-center w-full gap-4">
              <input type="text" placeholder="Buscar libros por autor o nombre..."
                class="bg-white shadow-sm w-full p-2 rounded-sm focus:outline-none rounded-lg" />
            </div>
            <div class="flex">
              <img src={`http://localhost:5000/market/upload/${payload?.image}`} alt="xd" class="h-[75px] w-[75px] rounded-full"></img>
              <img className="" alt="publicidad" />
            </div>
            <div></div>
            <div class="flex flex-wrap items-center space-x-4 p-2">
              <a href="/" class={classInput}>Libros</a>
              {!isLogged && <a class={classInput} onClick={() => { setVreg(!vReg) }} >Registrar</a>}
              {!isLogged && <a class={classInput} onClick={() => { setVlogin(!vLogin) }}>Ingresar</a>}
              {isLogged && userRole < 1 && (<a href="/makeme/author" class={classInput}>Hacerme Autor</a>)}
              {isLogged && userRole >= 1 && (<a href="/publication-book" class={classInput}>Publicar libro</a>)}
              {isLogged && userRole >= 1 && (<a href="/your-books" class={classInput}>Tus libros</a>)}
            </div>
            <div class="text-start flex flex-row gap-2 p-2">
              {isLogged && <a href="/carrito" class={classInput}>Tu carrito</a>}
              {isLogged && <a class={classInput} onClick={() => { logout() }}>Cerrar sesion</a>}
            </div>
          </div>
        }
      </header>
      <Register vReg={vReg} setVreg={setVreg} />
      <HandlerViewLogin vLogin={vLogin} setVlogin={setVlogin}/>
      <div class="w-full max-w-[1200px] flex-1 m-auto ">{<Outlet />/*<Market/>*/}</div>
    </div>
  )
}
