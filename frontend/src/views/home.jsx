import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import Register from "../components/register";
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

      {/*<header className="bg-[#C8A67C] p-2  m-auto w-full px-6 z-10 text-[#A8A29E]">*/}
      <header className="bg-gray-300">
        {
          <div className="m-auto w-fit grid grid-cols-1 sm:grid-cols-[162px_minmax(340px,588px)_minmax(150px,200px)]  gap-x-2 text-center p-2">
              <img  alt="ICONO" className="h-10" />
            <div className="flex-1 content-center w-full gap-4">
              <input type="text" placeholder="Buscar libros por autor o nombre..."
                className="bg-white shadow-sm w-full p-2 rounded-sm focus:outline-none rounded-lg" />
            </div>

            {
            //<div className="flex">
            //  <img src={`http://localhost:5000/market/upload/${payload?.image}`} alt="xd" className="h-[75px] w-[75px] rounded-full"></img>
            //  <img className="" alt="publicidad" />
            //</div>
            }
            <div/>
            <div></div>
            <div className="flex flex-wrap items-center gap-x-2">
              <a href="/1" className={classInput}>Libros</a>
              {!isLogged && <a className={classInput} onClick={() => { setVreg(!vReg) }} >Registrar</a>}
              {!isLogged && <a className={classInput} onClick={() => { setVlogin(!vLogin) }}>Ingresar</a>}
              {isLogged && userRole < 1 && (<Link to="/makeme/author" className={classInput}>Hacerme Autor</Link>)}
              {isLogged && userRole >= 1 && (<Link to="/publication-book" className={classInput}>Publicar libro</Link>)}
              {isLogged && userRole >= 1 && (<Link to="/your-books" className={classInput}>Tus libros</Link>)}
            </div>
            <div className="flex flex-row-reverse gap-2">
              {isLogged && <Link to="/carrito" className={classInput}>Tu carrito</Link>}
              {isLogged && <a className={classInput} onClick={() => { logout() }}>Cerrar sesion</a>}
            </div>
          </div>
        }
      </header>
      <Register vReg={vReg} setVreg={setVreg} />
      <HandlerViewLogin vLogin={vLogin} setVlogin={setVlogin}/>
      <div className="w-full max-w-[1200px] flex-1 m-auto ">{<Outlet />/*<Market/>*/}</div>
    </div>
  )
}
