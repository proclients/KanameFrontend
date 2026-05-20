<template>
  <div class="auth-wrap">
    <div class="auth-card fade-up">
      <div class="logo">
        <span>Kaname</span>
        <span class="kanji">要</span>
      </div>
      <p class="subtitle">Personal Finance Assistant</p>
      <div class="form">
        <input v-model="email" type="email" placeholder="Email" />
        <div class="pw-wrap">
          <input v-model="password" :type="show ? 'text' : 'password'" placeholder="Password" />
          <button class="eye" @click="show = !show">{{ show ? '🙈' : '👁️' }}</button>
        </div>
        <button class="btn-primary" @click="handleLogin" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p class="switch">Don't have an account? <router-link to="/register">Register</router-link></p>
        <p class="switch"><router-link to="/forgot-password">Lupa password?</router-link></p>
        <p v-if="error" class="err">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref(''), password = ref(''), show = ref(false), loading = ref(false), error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) { error.value = 'Please fill all fields'; return }
  loading.value = true; error.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.response?.data?.detail || 'Login failed'
  } finally { loading.value = false }
}
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 60%), var(--bg);
  padding: 24px;
}
.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px 32px;
}
.logo { font-size: 32px; font-weight: 800; display: flex; align-items: center; gap: 8px; justify-content: center; }
.logo .kanji { font-size: 28px; }
.subtitle { text-align: center; color: var(--muted); font-size: 13px; margin: 6px 0 28px; }
.form { display: flex; flex-direction: column; gap: 12px; }
.pw-wrap { position: relative; }
.pw-wrap input { padding-right: 44px; }
.eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; font-size: 16px; padding: 0; width: auto; }
.switch { text-align: center; font-size: 13px; color: var(--muted); }
.switch a { color: var(--accent); text-decoration: none; }
.err { color: var(--red); font-size: 13px; text-align: center; }
</style>
