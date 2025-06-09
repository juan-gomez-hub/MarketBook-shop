import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import imagen from '../assets/imagen.png'
import { API } from "../utils/backPaths";
import Dialog from "../utils/ui/dialog"

export default function() {

  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    fetch(`${API}/market/list/your-books`, {method:"POST", headers: { Authorization: localStorage.getItem("jwt") } })
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
    console.log("aca xd");
    console.log(selectedCard)
  })
  const [selectedCard, setSelectedCard] = useState()

  //const select = (param) => {
  //  setSelectedCard(param)
  //}

  useEffect(() => {
    if (selectedCard?.reference) {
      // Redirige solo si selectedCard ha cambiado y no es null/undefined
      navigate(`/modify-book/${selectedCard.reference}`);
      // Aquí puedes hacer la redirección, por ejemplo:
      // history.push(`/ruta/${selectedCard.id}`);
    }
  }, [selectedCard]);

  const esteDiv = useRef(null);

  return (
    <div class="w-full">
      <Dialog selectedCard={selectedCard} visibility={visibility} setVisibility={setVisibility} ref={esteDiv} />
      <div class="w-full grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] text-center break-words">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={book.reference} class="flex flex-col mt-[24px]  transition delay-150 duration-700 ease-in-out " style={{ border: "1px solid #E0E0E0" }}>
              <div class="m-4 ">
                <div>
                  <img src={book.cover_image ? book.cover_image : imagen} onClick={() => {
                    setSelectedCard(book);
                  }} class="hover:cursor-pointer m-auto h-[200px] hover:shadow-lg shadow-gray-500/50 select-none"></img>
                </div>
                <div class="flex flex-col mt-[14px] mt-auto ">
                  <div onClick={() => {
                    //select(book); toggleDiv();
                  }} class="hover:cursor-pointer text-base overflow-hidden -webkit-line-clamp-2" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{book.title}</div>

                  <h3 class=" overflow-hidden ">{book.author}</h3>

                  <h3 class="break-words  ">{book.release_date}</h3>
                  <h1>{book.price}</h1>
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
