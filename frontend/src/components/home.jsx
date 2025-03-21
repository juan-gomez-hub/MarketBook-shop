import { useState, useEffect } from "react";

export default function Home() {
  //const [position, setPosition] = useState({ x: 0, y: 0 });
  //
  //useEffect(() => {
  //  const handleMouseMove = (e) => {
  //    setPosition({ x: e.clientX, y: e.clientY });
  //  };
  //
  //  window.addEventListener("mousemove", handleMouseMove);
  //  return () => window.removeEventListener("mousemove", handleMouseMove);
  //}, []);
  //
  return (
    <div className="h-screen w-screen">
      <nav class="bg-[#ffe600] p-2  m-auto min-w-[595px] px-6">

        <div class="grid grid-cols-[20%_40%_40%]  gap-x-4 text-center ">
          <div class="w-full">
            <img className="width-fit" src="" alt="ICONO" class="h-10" />
          </div>

          <div class="flex-1 w-full gap-4">
            <input type="text" placeholder="Buscar libros por autor o nombre..."
              class="bg-white shadow-sm w-full p-2 rounded-sm focus:outline-none rounded-lg" />

          </div>
          <div class="">
            <img className="" alt="publicidad" />
          </div>
          <div></div>
          <div class="flex flex-wrap items-center space-x-4 p-2">
            <a href="#" class="text-sm text-gray-900">Categorías</a>
            <a href="#" class="text-sm text-gray-900">Ofertas</a>
            <a href="#" class="text-sm text-gray-900">Historial</a>
            <a href="#" class="text-sm text-gray-900">Vender</a>
            <a href="#" class="text-sm text-gray-900">Mi cuenta</a>
            <a href="#" class="text-sm text-gray-900">Carrito</a>
          </div>

        </div>
      </nav>
    </div>

  )
}
