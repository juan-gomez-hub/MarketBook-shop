import { useRef, useEffect, useState } from "react";
import imagen from '../../assets/imagen.png'

export function closeDialogOnClickOutside(visibility, setVisibility, divRef, padding_right = true) {
  if (visibility) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (padding_right)
      //document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflowY = 'hidden';
  } else {
    document.body.style.paddingRight = '';
    document.body.style.overflowY = 'visible';
  }
  const handleClickOutside = (event) => {

    if (divRef.current && !divRef.current.contains(event.target)) {
      if (visibility) {

        console.log(event)
        setVisibility(false)
        console.log("aca")
      }
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}


export default function Dialog({ selectedCard, visibility, sell = false, onClose }) {
  const [show, setShow] = useState(visibility);
  const divRef = useRef(null)

  useEffect(() => {
    setShow(visibility);
  }, [visibility]);

  function handleOutsideClick() {
    setShow(false);
    onClose(); // Avisamos al padre que se quiere cerrar
  }

  if (!show) return
  return (
    <div>
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onMouseUp={() => { handleOutsideClick() }}
      >
        <div id="xd"
          class=" w-[400px] 
               sm:w-[500px] md:w-[580px] lg:w-[680px] 
              flex flex-row  
              overflow-y-auto max-h-screen gap
              rounded-xl
        "
          onMouseUp={(e) => { e.stopPropagation() }}
          ref={divRef}>
          <div class="bg-gray-100 p-4 w-full">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex flex-row flex-1 gap-4">
                <div class="">
                  <img src={selectedCard.cover_image ? selectedCard.cover_image : imagen}
                    class="m-auto max-w-[120px] hover:shadow-lg shadow-gray-500/50 select-none"
                  />
                </div>
                <div class=" flex flex-col flex-1">
                  <p class="text-l font-semibold">{selectedCard.title}</p>
                  <div class="flex flex-row justify-end flex-1">
                    <div class="text-lg flex-1 flex flex-col justify-end">
                      <p class="text-md text-blue-800">{selectedCard.author}</p>
                      <p class="text-sm text-blue-400">{selectedCard.release_date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h1 class="text-l  mt-4 flex-shrink-0 break-words max-h-[50vh] md:min-h-[20vh] overflow-y-auto">
              Sinopsis: {selectedCard.description}
            </h1>
            <div class=" flex flex-wrap gap-2">
              <p class="text-lg font-bold content-center flex-1"><span class="text-sm">$</span>{selectedCard.price}</p>

              {sell && (<><input type="button" class="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 hover:cursor-pointer" onClick={() => { addToCart(selectedCard.reference) }} value="Agregar al carrito"></input>
                <input type="button" class="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 hover:cursor-pointer" onClick={() => { getCart(selectedCard.reference) }} value="Comprar libro"></input></>)}
            </div>
          </div>
          <div>
          </div>

        </div>
      </div>
    </div>
  )
}

//Agregar al carrito
const addToCart = (reference) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(reference);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Leer el carrito
function getCart() {
  console.log(JSON.parse(localStorage.getItem('cart') || '[]'))
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
