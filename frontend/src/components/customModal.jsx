import { useState, useEffect, useRef } from "react";

function modal(visibility, setVisibility, divRef, padding_right = true) {
  if (visibility) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (padding_right) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflowY = 'hidden';
    console.log("aca");
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
export default function ModalCustom({ children, visibility,setVisibility }) {

  const divRef = useRef(null)
  //
  useEffect(() => {
    modal(visibility, setVisibility, divRef, false)
  }, [visibility])

  if (!visibility) return null
  return (
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={divRef}
        class="rounded-md flex flex-col p-6 bg-[#F1F1F1] w-full max-w-[400px] mx-auto"
      >
        {children}
      </div>
    </div>
  )
}
