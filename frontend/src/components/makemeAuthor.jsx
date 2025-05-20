import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { data, Navigate } from "react-router-dom";
import { API } from "../utils/backPaths";
import { useAuth } from "./authProvider";
import ValidationInput, { ValidationTextArea } from "./validationInput";

export default function Prueba() {
  const [message, setMessage] = useState(null)
  const [validation, setValidation] = useState({ name: null, biography: null, loginValid: false })
  const [inputs, setInputs] = useState({ name: null, biography: null })
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [fileA, setFileA] = useState(null)


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileA(file)
      const url = URL.createObjectURL(file);
      setImage(url); // <- asegúrate que setImage esté correctamente definido
    }
  };


  const becomeAuthor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', fileA);
      const response = await fetch(`${API}/market/upload-cover`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem("jwt") },
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const data = await response.json();
      const uploadedFilename = data.filename; // usar variable local

      const authorResponse = await fetch(`${API}/market/makeme/author`, {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json',
          'Authorization': localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          name: inputs.name,
          biography: inputs.biography,
          image: uploadedFilename, // usar la variable
        })
      });

      if (!authorResponse.ok) throw new Error("Error al obtener la autorización desde el servidor");

      const newJwt = authorResponse.headers.get("Authorization");
      if (!newJwt) throw new Error("Error al obtener la autorización");

      localStorage.setItem("jwt", newJwt)
      //setMessage("Te has registrado como autor correctamente!<br>Serás redirigido en 5 segundos");
      //setTimeout(() => {
        window.location.reload()
      //}, 500);
    } catch (err) {
      console.error(err);
      alert('Hubo un problema');
    }
  };
  useEffect(() => {
    setValidation(validateInputs(inputs.name, inputs.biography));
  }, [inputs])

  const validLogin =
    inputs.name &&
    inputs.name.length >= 8 &&
    inputs.name.length <= 16 &&
    inputs.biography &&
    inputs.biography.length >= 25 &&
    inputs.biography.length <= 60;

  const inputclass = ` appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-start resize-none`

  return (
    <div class="h-full flex items-center justify-contents-center">
      <div class=" flex flex-col h-fit justify-items-center items-center h-full w-full">
        <form class="max-w-[700px] rounded-md border-2 bg-gray-100 border-gray-200 p-6 flex flex-col w-full m-auto gap-2 " onSubmit={(e) => { becomeAuthor(e) }}>
          <div class={`rounded-md border-2 border-green-200 bg-green-100 text-green-800 p-2 ${message ? '' : 'invisible'}`}>&nbsp;{message}</div>
          <div class="flex gap-6 min-h-[250px]">
            {
              //<textarea className={inputclass} placeholder="Ingrese la biografia del autor" ></textarea>
            }
            <ValidationTextArea
              title="Biografia del autor"
              onChange={(value) => { setInputs((prev) => ({ ...prev, biography: value })) }}
              error={validation.biography}
            />
            <div class="flex flex-col gap-4">
              {/* Botón personalizado */}
              <button
                onClick={handleClick}
                className="bg-blue-600 text-white px-2  rounded hover:bg-blue-700"
                type="button"
              >
                Subir imagen
              </button>
              {/* Input file oculto */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                class="hidden"
              />
              <img className="width-fit h-80" src={image} alt="Preview" class="h-[150px]" />
            </div>
          </div>
          {
            //<input className={inputclass} placeholder="Ingrese el nombre del autor" ></input>
          }
          <ValidationInput
            placeholder="texto"
            title="Nombre del autor"
            onChange={(value) => { setInputs((prev) => ({ ...prev, name: value })) }}
            error={validation.name}
          />
          <input disabled={!validLogin} type="submit" class="disabled:bg-gray-600 bg-blue-600 text-white rounded " value="Hacerme autor"></input>
        </form>
      </div>

    </div>
  )
}

const validateInputs = (name, biography) => ({
  name:
    !name ? null :
      name.length < 8 ? "El nombre debe tener al menos 8 caracteres" :
        name.length > 16 ? "El nombre debe tener menos de 16 caracteres" : null,
  biography:
    !biography ? null :
      biography.length < 25 ? "La biografía debe tener al menos 25 caracteres" :
        biography.length > 60 ? "La biografía debe tener menos de 60 caracteres" : null,
});
