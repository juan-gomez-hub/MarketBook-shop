import { useState, useRef, useEffect } from "react"
import { useAuth } from "./authProvider"
import { ValidationTextArea } from "./validationInput"
import ValidationInput from "./validationInput"
import { useParams } from "react-router-dom";
import imagen from '../assets/imagen.png'
import { fetchBook, modifyBookRequest, uploadCover } from "./api";
import validationBook from "../utils/validationBook";

var dateMin = new Date("Jan 01, 1900").toISOString().split('T')[0];

export default function() {
  const [message, setMessage] = useState({ message: null, error: false })
  //const values = { title: null, description: null, price: null, date: null }
  //const [validation, setValidation] = useState(values)
  //const [values, setValues] = useState(values)
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [fileA, setFileA] = useState(null)

  const { values, setValues, validation, setValidation, setIsValid, isValid } = validationBook({ title: null, description: null, price: null, date: null }, { title: true, description: true, price: true, date: true })
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

  const modifyBook = async (e) => {
    e.preventDefault();
    try {
      const responseImage = await uploadCover(fileA)
      const uploadedFilename = responseImage.filename; // usar variable local
      const fecha = values.date
      const soloFecha = fecha

      let responseBook = await modifyBookRequest({
        reference: id,
        title: values.title,
        description: values.description,
        price: values.price,
        release_date: soloFecha,
        cover_image: uploadedFilename,
      })

      if (responseBook) {
        setMessage({ 'message': "Libro modificado exitosamente", 'error': false })
      }
    } catch (err) {
      console.error(err);
      setMessage({ 'message': 'No se pudo establecer conexión con el servidor', 'error': true })
    }
  };




  const messageClass = `p-2
  ${message.message && (message.error ? "border-2 rounded-md text-red-900 bg-red-300 border-red-900 rounded-md "
      : "text-green-900 bg-green-400 border-green-900 border-2 rounded-md ")}`
  let { id } = useParams()

  useEffect(() => {
    const prueba = async () => {
      try {
        const valor = await fetchBook({ reference: id })
        const formattedDate = new Date(valor.success.release_date).toISOString().split('T')[0];
        setValues((prev) => ({ ...prev, title: valor.success.title, description: valor.success.description, price: valor.success.price, date: formattedDate }))
        if (valor.success.cover_image) {
          setImage(`http://localhost:5000/market/upload/${valor.success.cover_image}`)
        }
        else {
          setImage(`${imagen}`)
        }
      } catch (err) {
        console.error(err);
        setMessage({ 'message': 'No se pudo establecer conexión con el servidor', 'error': true })
      }
    }
    prueba()
  }, [])
  return (
    <div class="h-full flex items-center justify-contents-center">
      <div class=" flex flex-col h-fit justify-items-center items-center h-full w-full">

        <h1>MODIFICACION DE LIBRO</h1>
        <form class="max-w-[700px] rounded-md border-2 border-gray-200 p-6 flex flex-col w-full m-auto gap-2 " onSubmit={(e) => { modifyBook(e) }}>
          <div class={messageClass} >{message.message}</div>
          <div class="flex gap-6 min-h-[250px]">
            {
              //<textarea className={inputclass} placeholder="Ingrese la biografia del autor" ></textarea>
            }
            <div class="flex flex-col flex-1">
              <ValidationInput
                value={values.title}
                placeholder="texto"
                title="Titulo del libro"
                onChange={(value) => { setValues((prev) => ({ ...prev, title: value })) }}
                error={validation.title}
              />
              <ValidationTextArea
                clase="min-h-[240px]"
                value={values.description}
                title="Descripción del libro"
                onChange={(value) => { setValues((prev) => ({ ...prev, description: value })) }}
                error={validation.description}
              />
              <div class="flex flex-row justify-between">
                <ValidationInput
                  type="number"
                  value={values.price}
                  title="price"
                  onChange={(value) => { setValues((prev) => ({ ...prev, price: value })) }}
                  error={validation.price}
                />
                {
                  <ValidationInput
                    title="fecha de publicacion"
                    type="date"
                    value={values.date}
                    onChange={(value) => {
                      console.log(`date min es :${dateMin}\n date es:${new Date(value)}`)
                      console.log(dateMin < new Date(value))
                      setValues((prev) => ({ ...prev, date: new Date(value).toISOString().split('T')[0] }))
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

          <input disabled={!isValid} type="submit" class="hover:cursor-pointer disabled:bg-gray-600 disabled:cursor-default bg-blue-600 text-white rounded " value="Modificar libro"></input>
        </form>
      </div>

    </div>
  )
}

