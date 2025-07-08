//import React from "react";
import { useState, useEffect, useRef } from "react";
import Dialog from "../utils/ui/dialog";
import imagen from '../assets/imagen.png'
import { API } from "../utils/backPaths";
import { useParams } from "react-router-dom";
import Pagination from "../utils/ui/pagination";

function SkeletonBook() {
  return (
    <div className="flex flex-col mt-[24px] animate-pulse bg-gray-200 rounded-md shadow-md">
      <div className="m-2 h-full">
        <div className="bg-gray-300 h-[200px] rounded-md mb-4" />
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-2" />
        <div className="h-5 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function Market() {
  const [books, setBooks] = useState([]);
  const [countBooks, setCountBooks] = useState(null)
  const [perPage, setPerPage] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [visibility, setVisibility] = useState(false)

  const { page } = useParams()
  useEffect(() => {
    fetch(`${API}/market/list/book/${page}`)
      .then((response) => {
        if (!response.ok) {
          setLoading(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //if (!response.json().Success)
        //  throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => { setLoading(false); if (data.Success.books) setBooks(data.Success.books); setCountBooks(data.Success.total_books); setPerPage(data.Success.per_page) })
      .catch((error) => setError(error.message));
  }, [page]);
  const toggleDiv = (() => {
    setVisibility(!visibility)
  })
  const [selectedCard, setSelectedCard] = useState()

  const selectBook = (book) => {
    setSelectedCard(book); toggleDiv();
  }

  const esteDiv = useRef(null);

  return (
    <div className="w-full">
      <Dialog
        selectedCard={selectedCard}
        visibility={visibility}
        sell={true}
        onClose={() => {
          setVisibility(false);
        }}
      />

      {loading ? (
        <div className="w-full grid gap-8 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] text-center">
          {Array.from({ length: 30 }).map((_, i) => (
            <SkeletonBook key={i} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="w-full grid gap-8 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] text-center break-words">
            {books.map((book) => (
              <div
                key={book.reference}
                className="flex flex-col mt-[24px] transition delay-100 duration-150 ease-in-out bg-white shadow-md shadow-gray-200 hover:shadow-gray-300 hover:cursor-pointer rounded-md shadow-md"
                style={{ border: "1px solid #E0E0E0" }}
                onClick={() => selectBook(book)}
              >
                <div className="m-2 h-full">
                  <div>
                    <img
                      src={book.cover_image ? book.cover_image : imagen}
                      className="hover:cursor-pointer m-auto h-[200px] hover:shadow-lg shadow-gray-500/50 select-none"
                    />
                  </div>
                  <div className="flex flex-col mt-[14px] mt-auto">
                    <div
                      className="hover:cursor-pointer text-base overflow-hidden -webkit-line-clamp-2 font-semibold"
                      style={{
                        WebkitLineClamp: 2,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {book.title}
                    </div>
                    <h3 className="overflow-hidden text-blue-800">{book.author}</h3>
                    <p className="text-lg font-medium content-center flex-1">
                      <span className="text-sm">$</span>
                      {book.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full my-4 text-center justify-items-center">
            <Pagination page={page} countBooks={countBooks} perPage={perPage} onclick={() => { setLoading(true) }} />
          </div>
        </>
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
}
