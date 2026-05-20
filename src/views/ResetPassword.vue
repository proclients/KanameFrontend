<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-logo">
        <span class="kanji">要</span>
        <span class="brand">Kaname</span>
      </div>
      <h2>Reset Password</h2>

      <div v-if="success" class="success-box">
        Password berhasil direset! <router-link to="/login">Login sekarang</router-link>
      </div>

      <template v-else>
        <p class="sub" v-if="!token">Token tidak valid atau sudah expired.</p>
        <template v-else>
          <input v-model="newPassword" type="password" placeholder="Password baru (min 6 karakter)" :disabled="loading" />
          <input v-model="confirmPassword" type="password" placeholder="Konfirmasi password" :disabled="loading" />
          <div v-if="error" class="err">{{ error }}</div>
          <button class="btn-primary" @click="submit" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Reset Password' }}
          </button>
        </template>
      </template>

      <div class="auth-footer">
        <router-link to="/login">Kembali ke Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  token.value = route.query.token || ''
})

async function submit() {
  if (!newPassword.value || newPassword.value.length < 6) { error.value = 'Password minimal 6 karakter'; return }
  if (newPassword.value !== confirmPassword.value) { error.value = 'Password tidak sama'; return }
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/reset-password', { token: token.value, new_password: newPassword.value })
    success.value = true
  } catch (e) {
    error.value = e.response?.data?.detail || 'Token tidak valid atau sudah expired'
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
.sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
input { width: 100%; margin-bottom: 12px; }
.err { color: var(--red); font-size: 13px; margin-bottom: 10px; }
.success-box { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 10px; padding: 14px; font-size: 13px; color: #22c55e; line-height: 1.6; }
.success-box a { color: var(--accent); }
.btn-primary { width: 100%; margin-top: 4px; }
.auth-footer { text-align: center; margin-top: 20px; font-size: 13px; }
.auth-footer a { color: var(--accent); text-decoration: none; }
</style>
