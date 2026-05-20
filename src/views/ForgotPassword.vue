<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-logo">
        <span class="kanji">要</span>
        <span class="brand">Kaname</span>
      </div>
      <h2>Lupa Password</h2>
      <p class="sub">Masukkan email kamu, kami akan kirim link reset password.</p>

      <div v-if="sent" class="success-box">
        Email terkirim! Cek inbox kamu (termasuk folder spam). Link berlaku 15 menit.
      </div>

      <template v-else>
        <input v-model="email" type="email" placeholder="Email" :disabled="loading" />
        <div v-if="error" class="err">{{ error }}</div>
        <button class="btn-primary" @click="submit" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
        </button>
      </template>

      <div class="auth-footer">
        <router-link to="/login">Kembali ke Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  if (!email.value) { error.value = 'Email wajib diisi'; return }
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    sent.value = true
  } catch (e) {
    error.value = e.response?.data?.detail || 'Terjadi kesalahan'
  }
  loading.value = false
}
</script>

<style scoped>
.auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; background: var(--bg); }
.auth-card { width: 100%; max-width: 380px; background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 32px 24px; }
.auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
.kanji { font-size: 36px; color: var(--accent); }
.brand { font-size: 24px; font-weight: 800; }
h2 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.6; }
input { width: 100%; margin-bottom: 12px; }
.err { color: var(--red); font-size: 13px; margin-bottom: 10px; }
.success-box { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 10px; padding: 14px; font-size: 13px; color: #22c55e; line-height: 1.6; }
.btn-primary { width: 100%; margin-top: 4px; }
.auth-footer { text-align: center; margin-top: 20px; font-size: 13px; }
.auth-footer a { color: var(--accent); text-decoration: none; }
</style>
