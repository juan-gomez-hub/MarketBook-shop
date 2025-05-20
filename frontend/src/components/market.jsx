//import React from "react";
import { useState, useEffect, useRef } from "react";
import Dialog from "./dialog";
import imagen from '../assets/imagen.png'
import { API } from "../utils/backPaths";

export default function Market() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    fetch(`${API}/market/list/book`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //if (!response.json().Success)
        //  throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => { if (data.Success) setBooks(data.Success) })
      .catch((error) => setError(error.message));
  }, []);
  const toggleDiv = (() => {
    setVisibility(!visibility)
    //console.log(visibility)
    //setSelectedCard(books[0])
  })
  const [selectedCard, setSelectedCard] = useState()

  const select = (param) => {
    setSelectedCard(param)
  }

  const esteDiv = useRef(null);

  return (
    <div class="w-full">
      {/*<button onClick={toggleDiv}>Mostrar Div</button>*/}
      <Dialog selectedCard={selectedCard} visibility={visibility} setVisibility={setVisibility} ref={esteDiv} />
      <div class="w-full grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] text-center break-words">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={book.reference} class="flex flex-col mt-[24px]  transition delay-100 duration-150 ease-in-out bg-white shadow-md shadow-gray-200 hover:shadow-gray-300 hover:cursor-pointer" style={{ border: "1px solid #E0E0E0" }}>
              <div class="m-2 h-full ">
                <div>
                  <img src={book.cover_image ? book.cover_image : imagen} onClick={() => {
                    select(book); toggleDiv();
                  }} class="hover:cursor-pointer m-auto h-[200px] hover:shadow-lg shadow-gray-500/50 select-none"></img>
                </div>
                <div class="flex flex-col mt-[14px] mt-auto ">
                  <div onClick={() => {
                    select(book); toggleDiv();
                  }} class="hover:cursor-pointer text-base overflow-hidden -webkit-line-clamp-2 font-semibold" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{book.title}</div>

                  <h3 class=" overflow-hidden text-blue-800">{book.author}</h3>

                  <p class="text-lg font-medium content-center flex-1"><span class="text-sm">$</span>{book.price}</p>
                </div>
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
