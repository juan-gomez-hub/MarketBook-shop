import { useState, useRef, useEffect } from "react"
import { useAuth } from "./authProvider"
import { ValidationTextArea } from "./validationInput"
import ValidationInput from "./validationInput"
import validationBook from "../utils/validationBook";
import { API } from "../utils/backPaths";

var dateMin = new Date("Jan 01, 1900");
export default function() {
  const { userData, user, logout, isLogged, isLoading, changeImage } = useAuth()
  const [message, setMessage] = useState({ message: null, error: false })
  //const values = { title: null, description: null, price: null, date: null }
  //const [validation, setValidation] = useState(values)
  //const [inputs, setInputs] = useState(values)
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [fileA, setFileA] = useState(null)


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const { values, setValues, validation, setValidation,setIsValid,isValid } = validationBook({ title: null, description: null,price:null,date:null }, { title: true, description: true,price:true,date:true })
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileA(file)
      const url = URL.createObjectURL(file);
      setImage(url); // <- asegúrate que setImage esté correctamente definido
    }
  };


  const uploadBook = async (e) => {
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
      const fecha = values.date
      const soloFecha = new Intl.DateTimeFormat('en-CA').format(fecha);
      const responseBook = await fetch("http://localhost:5000/market/create/book", {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json',
          'Authorization': localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          price: values.price,
          release_date: soloFecha,
          cover_image: uploadedFilename, // usar la variable
        })
      });

      if (!responseBook.ok) {
        setMessage({ 'message': 'Error interno al crear el libro', 'error': true })
      }

      if (responseBook.ok) {
        setMessage({ 'message': "Libro publicado exitosamente", 'error': false })
      }
    } catch (err) {
      console.error(err);
      setMessage({ 'message': 'No se pudo establecer conexión con el servidor', 'error': true })
    }
  };

  const inputclass = ` appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-start resize-none`

  const messageClass = `p-2
  ${message.message && (message.error ? "border-2 rounded-md text-red-900 bg-red-300 border-red-900 rounded-md "
      : "text-green-900 bg-green-400 border-green-900 border-2 rounded-md ")}`
  return (
    <div class="h-full flex items-center justify-contents-center">
      <div class=" flex flex-col h-fit justify-items-center items-center h-full w-full">
        <form class="max-w-[700px] rounded-md border-2 border-gray-200 p-6 flex flex-col w-full m-auto gap-2 " onSubmit={(e) => { uploadBook(e) }}>
          <div class={messageClass} >{message.message}</div>
          <div class="flex gap-6 min-h-[250px]">
            {
              //<textarea className={inputclass} placeholder="Ingrese la biografia del autor" ></textarea>
            }
            <div class="flex flex-col flex-1">
              <ValidationInput
                placeholder="texto"
                title="Titulo del libro"
                onChange={(value) => { setValues((prev) => ({ ...prev, title: value })) }}
                error={validation.title}
              />
              <ValidationTextArea
                clase="min-h-[240px]"
                title="Descripción del libro"
                placeholder="breve descripción del libro"
                onChange={(value) => { setValues((prev) => ({ ...prev, description: value })) }}
                error={validation.description}
              />
              <div class="flex flex-row justify-between">
                <ValidationInput
                  type="number"
                  placeholder="precio del libro"
                  title="price"
                  onChange={(value) => { setValues((prev) => ({ ...prev, price: value })) }}
                  error={validation.price}
                />
                {
                  <ValidationInput
                    title="fecha de publicacion"
                    type="date"
                    onChange={(value) => {
                      console.log(`date min es :${dateMin}\n date es:${new Date(value)}`)
                      console.log(dateMin < new Date(value))
                      setValues((prev) => ({ ...prev, date: new Date(value) }))
                    }}
                    error={validation.date}
                  />
                  //<input type="date" />
                }
              </div>
            </div>
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

          <input disabled={!isValid} type="submit" class="disabled:bg-gray-600 bg-blue-600 text-white rounded " value="Hacerme autor"></input>
        </form>
      </div>

    </div>
  )
}

//const validateInputs = (title, description, price, date) => (
//  {
//    title:
//      !title ? null :
//        title.length < 4 ? "El nombre debe tener al menos 4 caracteres" :
//          title.length > 70 ? "El nombre debe tener menos de 70 caracteres" : null,
//    description:
//      !description ? null :
//        description.length < 4 ? "La biografía debe tener al menos 4 caracteres" :
//          description.length > 1200 ? "La biografía debe tener menos de 1200 caracteres" : null,
//    price:
//      !price ? null :
//        price < 1 ? "El precio debe ser mayor a 0" :
//          price > 9999999 ? "El precio debe ser menor a 9999999" : null,
//    date:
//      !date ? null :
//        dateMin > date ? "Ingrese una fecha valida" : null
//  });
