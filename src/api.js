import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://client0-kanamebackend.hf.space',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kaname_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
