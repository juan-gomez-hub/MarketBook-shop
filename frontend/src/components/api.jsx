//const API_BASE = 'http://localhost:5000/market'
import { API } from "../utils/backPaths"

export const uploadCover = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API}/market/upload-cover`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('jwt'),
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Error al subir la imagen')
  }

  return await response.json()
}

export const modifyBookRequest = async (payload) => {
  const response = await fetch(`${API}/market/modify/your-book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: localStorage.getItem('jwt'),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Error interno al crear el libro')
  }

  return await response.json()
}

export const fetchBook = async (payload) => {
  const response = await fetch(`${API}/market/get/your-book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: localStorage.getItem('jwt'),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Error al obtener el libro')
  }

  return await response.json()
}

