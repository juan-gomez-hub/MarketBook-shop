import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function({ page, countBooks, perPage,onclick }) {
  page = parseInt(page)
  const pageMax = countBooks / perPage
  const isDisabledPrevious = page <= 1; // true si es la primera página
  const isDisabledNext = page >= pageMax; // true si es la última página

  const previousPage = page - 1
  const nextPage = page + 1

  // Genera un rango de páginas alrededor de la actual (3 anteriores y 3 siguientes)
  const getPageRange = () => {
    const totalSlots = 12;
    const range = [];

    // Mostrar todas si hay 12 o menos
    if (pageMax <= totalSlots) {
      for (let i = 1; i <= pageMax; i++) range.push(i);
      return range;
    }

    range.push(1); // Siempre el primero

    let middleSlots = totalSlots - 2; // quitamos el primero y último
    let start = Math.max(2, page - Math.floor(middleSlots / 2));
    let end = start + middleSlots - 1;

    // Ajuste si el final se pasa del total
    if (end >= pageMax) {
      end = pageMax - 1;
      start = end - middleSlots + 1;
    }

    // Mostrar "…" si hay páginas ocultas entre 1 y start
    if (start > 2) {
      range.push("…");
    }

    // Rango del medio
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Mostrar "…" si hay páginas ocultas entre end y pageMax
    if (end < pageMax - 1) {
      range.push("…");
    }

    range.push(pageMax); // Siempre el último

    // Ajustar si hay menos de 12 elementos
    while (range.length < totalSlots) {
      // Intenta agregar más antes de start si hay espacio
      if (range[1] === "…" && range[2] > 2) {
        range.splice(2, 0, range[2] - 1);
      }
      // O intenta después del penúltimo si hay espacio
      else if (range[range.length - 2] < pageMax - 1) {
        range.splice(range.length - 1, 0, range[range.length - 2] + 1);
      } else {
        break;
      }
    }

    return range;
  };
  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return (
    <>
      <ul className=" bg-gray-300 rounded-md shadow-md flex flex-wrap gap-2 m-4 px-2 py-1 select-none text-2xl" id="pagi">
        <Link
          to={`/${previousPage}`}
          onClick={(e) => { isDisabledPrevious && e.preventDefault(); moveToTop();onclick()}}
          className={isDisabledPrevious ? "rounded-md bg-gray-300 px-2 pointer-events-none text-gray-500" : "rounded-md bg-gray-200 px-2 pointer-events-auto text-blue-500"}
        >
          {'<'}
        </Link>
        {getPageRange().map((pageNumber) => (
          <Link
            key={pageNumber}
            to={`/${pageNumber}`}
            onClick={()=>{moveToTop();onclick()}}
            className={pageNumber == page ? "text-white text-xl bg-blue-400 rounded-md px-2" : " px-2 text-blue-400 text-xl bg-gray-200 rounded-md"}
          >
            {pageNumber}
          </Link>
        ))}
        <Link
          to={`/${nextPage}`}
          onClick={(e) => { isDisabledNext && e.preventDefault(); moveToTop();onclick() }}
          className={isDisabledNext ? "rounded-md bg-gray-300 px-2 pointer-events-none text-gray-500" : "rounded-md bg-gray-200 px-2 pointer-events-auto text-blue-500"}
        >
          {'>'}
        </Link>
      </ul>
    </>
  )
}
