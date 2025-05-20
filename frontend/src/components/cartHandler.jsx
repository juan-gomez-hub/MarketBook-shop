
import { useState, useEffect, useRef } from "react";
import Dialog from "./dialog";
import imagen from '../assets/imagen.png'
import { API } from "../utils/backPaths";
const getCartStorage = () => { return (JSON.parse(localStorage.getItem('cart') || '[]')) }

const deleteBookFromStorage = (reference) => {
  const actual = getCartStorage();
  const updated = actual.filter(item => item !== reference);
  localStorage.setItem('cart', JSON.stringify(updated));
}

export default function() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const total = books.reduce((acumulador, libro) => {
      return acumulador + libro.price * libro.cant;
    }, 0);
    setTotal(total)
  }, [books])

  const [visibility, setVisibility] = useState(false)
  const removeBook = (refToRemove) => {
    //console.log(refToRemove)
    setBooks(prevBooks => prevBooks.filter(book => book.reference !== refToRemove));
  };
  useEffect(() => {
    const valor = (JSON.parse(localStorage.getItem('cart') || '[]'))
    fetch(`${API}/market/get/cart`, { method: "POST", headers: { 'Authorization': localStorage.getItem("jwt"), 'Content-type': 'Application/json' }, body: JSON.stringify({ "cart": valor }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.Success.libros) {
          setBooks(data.Success.libros);
        }
      })
      .catch((error) => setError(error.message));
  }, []);
  const toggleDiv = (() => {
    setVisibility(!visibility)
  })
  const [selectedCard, setSelectedCard] = useState()

  const select = (param) => {
    setSelectedCard(param)
  }
  const decreaseCantByReference = (ref) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.reference === ref && book.cant >= 2
          ? { ...book, cant: book.cant - 1 }
          : book
      )
    );
  };

  const increaseCantByReference = (ref) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.reference === ref && book.cant <= 9
          ? { ...book, cant: book.cant + 1 }
          : book
      )
    );
  };

  useEffect(() => {
    const final = books.flatMap(val => Array(val.cant).fill(val.reference));
    localStorage.setItem('cart', JSON.stringify(final))
  }, [books])

  const subBook = (ref) => {
    decreaseCantByReference(ref)
  }
  const sumBook = (ref) => {
    increaseCantByReference(ref)
  }

  const esteDiv = useRef(null);

  return (
    <div class="w-full flex flex-col" >
      {/*<button onClick={toggleDiv}>Mostrar Div</button>*/}
      <Dialog selectedCard={selectedCard} visibility={visibility} setVisibility={setVisibility} ref={esteDiv} />
      <div class="w-full flex flex-col text-center break-words gap-4 px-4">
        <div class="bg-white flex gap-4 flex-row-reverse shadow-md shadow-gray-300 px-4 rounded-md">      <div>Total a pagar: <span class="text-sm">$</span>{total}</div>
          <input type="button" value="pagar carrito" class="px-4 text-white bg-blue-400 hover:bg-blue-500 hover:cursor-pointer"></input>
        </div>
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} class="flex flex-col bg-white transition delay-150 duration-700 ease-in-out shadow-md rounded-md " style={{ border: "1px solid #E0E0E0" }}>
              <div class="p-4 h-full w-full flex flex-row gap-2 hover:cursor-pointer" onMouseUp={() => { select(book); toggleDiv(); }}>

                <div class="flex-shrink-0">
                  <img src={book.cover_image ? book.cover_image : imagen} onClick={() => {
                  }} class=" flex-shrink-0 hover:cursor-pointer m-auto h-[120px] hover:shadow-lg shadow-gray-500/50 select-none"></img>
                </div>
                <div class="flex flex-col flex-1">
                  <div onClick={() => {
                    //select(book); toggleDiv();
                  }} class="flex">
                    <h1 class=" text-base overflow-hidden -webkit-line-clamp-2 font-semibold flex-1 text-start" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{book.title}</h1>
                    <div class="text-blue-800 flex rounded-md border-gray-400 border divide-x divide-gray-200 select-none" onMouseUp={(e) => { e.stopPropagation() }}>
                      <h1 class="px-2" onClick={() => { console.log("restaste"); subBook(book.reference) }}>-</h1>
                      <h1 class="px-2">{book.cant}</h1>
                      <h1 class="px-2" onClick={() => { console.log("sumaste"); sumBook(book.reference) }}>+</h1>
                    </div>
                  </div>

                  <h1 class="text-justify -webkit-line-clamp-2 overflow-hidden" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{book.description}</h1>
                  <h3 class=" overflow-hidden text-blue-800 text-start">{book.author}</h3>

                  <p class="text-lg font-medium content-center text-start"><span class="text-sm">$</span>{book.price}</p>
                </div>
                <div class="font-bold hover:cursor-pointer select-none h-fit text-gray-800 hover:text-black" onMouseUp={(e) => { e.stopPropagation(); setTimeout(() => { deleteBookFromStorage(book.reference); removeBook(book.reference) }, ) }}>X</div>
              </div>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  )
}
