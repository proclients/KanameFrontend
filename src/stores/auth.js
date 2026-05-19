import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('kaname_user') || 'null'),
    token: localStorage.getItem('kaname_token') || null,
  }),
  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('kaname_token', this.token)
      localStorage.setItem('kaname_user', JSON.stringify(this.user))
    },
    async register(email, password, name) {
      const res = await api.post('/auth/register', { email, password, name })
      this.token = res.data.token
      this.user = res.data.user
      localStorage.setItem('kaname_token', this.token)
      localStorage.setItem('kaname_user', JSON.stringify(this.user))
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('kaname_token')
      localStorage.removeItem('kaname_user')
    }
  }
})
