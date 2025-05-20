//import { createContext, useContext, useState } from "react";
//
//export const AuthContext = createContext();
//
//export const AuthProvider = ({ children }) => {
//  const [user, setUser] = useState(null);
//  const [isLoggedIn, setIsLoggedIn] = useState(false);
//
//  const setLogged=(param)=>{
//    setIsLoggedIn(param)
//  }
//
//  const userData = (data) => {
//    setUser(data);
//  };
//
//  const logout = () => {
//    setUser(null);
//  };
//
//  return (
//    <AuthContext.Provider value={{ user, isLoggedIn, userData,setLogged, logout }}>
//      {children}
//    </AuthContext.Provider>
//  );
//};
//
//export const useAuth = () => useContext(AuthContext);
// AuthContext.js
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode"
import { API } from '../utils/backPaths';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const refreshTimeoutRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']); // Solo necesitamos leer y eliminar

  const [payload, setPayload] = useState(null)

  const [authState, setAuthState] = useState({
    isLogged: false,
    userRole: null,
    isLoading: true, // Para manejar estado de carga inicial
    payload: { 'image': null },
  });
  const loadPayload = (param) => {
    setPayload(param)
  }

  const [userInfo, setUserInfo] = useState({ image: null, name: null })

  const changeImage = (param) => {
    setUserInfo((prev) => ({ ...prev, image: param }))
  }

  const refreshToken = async (token) => {
    try {
      console.log("paso por refresh token")
      fetch(`${API}/api/authToken/refreshToken`,
        {
          method: 'POST',
          headers: { "authorization": token }
        })
        .then(data => data.json())
        .then(response => response.token)
        .then(token => { localStorage.setItem("jwt", token); checkAuth() })
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("jwt");

    if (token == null) {
      console.log("Not token found")
      setAuthState(prev => ({ ...prev, isLogged: false, userRole: null, isLoading: false }));
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        //setPayload(decoded.userInfo)
        setAuthState(prev => ({
          ...prev,
          isLogged: true,
          userRole: decoded.role,
          isLoading: false,
          payload: decoded.userInfo
        }));
        scheduleRefresh(token);
      } else {
        setPayload(null)
        localStorage.removeItem("jwt")
        setAuthState(prev => ({ ...prev, isLogged: false, userRole: null, isLoading: false,payload:null }));
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("jwt")
      setAuthState(prev => ({ ...prev, isLogged: false, userRole: null, isLoading: false,payload:null }));
      setPayload(null)
    }
  };

  const scheduleRefresh = () => {
    try {
      const token = localStorage.getItem("jwt");
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000; // exp viene en segundos, JS usa ms
      const now = Date.now();
      const delay = exp - now - 60 * 1000; // 1 minuto antes de que expire

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current); // Limpia cualquier timeout anterior
      }

      if (delay > 0) {
        console.log(`⏳ Token se refrescará en ${Math.floor(delay / 1000)} segundos`);
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken(token);
        }, delay);
      }
      //else {
      //  console.log("⚠️ Token  expirado");
      //  //refreshToken();
      //}
    } catch (err) {
      console.error("Error al programar refresh:", err);
    }
  };
  // Efecto para verificación inicial y cambios
  useEffect(() => {
    checkAuth();
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [localStorage.getItem("token")]); // Se ejecuta cuando cambia la cookie


  const logout = () => {
    localStorage.removeItem("jwt")
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    checkAuth(); // Actualiza el estado inmediatamente
  };

  const login = (token) => {
    let d = new Date();
    let minutes = 15
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    localStorage.setItem("jwt", token);
    checkAuth();
  }
  useEffect(() => {
    window.addEventListener("storage", () => {
      // When storage changes refetch
      console.log("cambia el storage")
      //refetch();
    });

    //return () => {
    //  // When the component unmounts remove the event listener
    //  window.removeEventListener("storage");
    //};
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      loadPayload,
      login,
      logout,
      checkAuth,
      changeImage
      //authorInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
