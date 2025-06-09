import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function({ page, countBooks, perPage, onclick }) {
  page = parseInt(page)
  const pageMax = Math.ceil(countBooks / perPage);
  const previousPage = page - 1;
  const nextPage = page + 1;
  if (pageMax <= 1) return null;

  const getPageRange = () => {
    const totalSlots = 12;
    const range = [];

    if (pageMax <= totalSlots) {
      for (let i = 1; i <= pageMax; i++) range.push(i);
      return range;
    }

    range.push(1);

    let middleSlots = totalSlots - 2;
    let start = Math.max(2, page - Math.floor(middleSlots / 2));
    let end = start + middleSlots - 1;

    if (end >= pageMax) {
      end = pageMax - 1;
      start = end - middleSlots + 1;
    }

    if (start > 2) {
      range.push("…");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < pageMax - 1) {
      range.push("…");
    }

    range.push(pageMax);

    while (range.length < totalSlots) {
      if (range[1] === "…" && range[2] > 2) {
        range.splice(2, 0, range[2] - 1);
      } else if (range[range.length - 2] < pageMax - 1) {
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
    <ul className="bg-gray-300 rounded-md shadow-md flex flex-wrap gap-2 m-4 px-2 py-1 select-none text-2xl" id="pagi">
      {page > 1 && (
        <Link
          to={`/${previousPage}`}
          onClick={(e) => { moveToTop(); onclick(); }}
          className="rounded-md bg-gray-200 px-2 text-blue-500"
        >
          {'<'}
        </Link>
      )}
      
      {getPageRange().map((pageNumber) => (
        <Link
          key={pageNumber}
          to={pageNumber === "…" ? "#" : `/${pageNumber}`}
          onClick={(e) => {
            if (pageNumber === "…") {
              e.preventDefault();
              return;
            }
            moveToTop();
            onclick();
          }}
          className={
            pageNumber == page
              ? "text-white text-xl bg-blue-400 rounded-md px-2"
              : pageNumber === "…"
              ? "px-2 text-gray-500 text-xl"
              : "px-2 text-blue-400 text-xl bg-gray-200 rounded-md"
          }
        >
          {pageNumber}
        </Link>
      ))}

      {page < pageMax && (
        <Link
          to={`/${nextPage}`}
          onClick={(e) => { moveToTop(); onclick(); }}
          className="rounded-md bg-gray-200 px-2 text-blue-500"
        >
          {'>'}
        </Link>
      )}
    </ul>
  );
}

