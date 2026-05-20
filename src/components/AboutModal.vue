<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="about-modal">
      <button class="close-btn" @click="$emit('close')">×</button>

      <div class="profile-section">
        <img src="https://raw.githubusercontent.com/proclients/KanameFrontend/main/public/IMG_20260520_142808.png" class="avatar-img" alt="Salman" />
        <div class="profile-info">
          <h2 class="name-anim">Salman</h2>
          <p class="role">Mahasiswa Sistem Informasi | AI Engineer Track | Jakarta</p>
          <div class="social-links">
            <a href="https://www.tiktok.com/@uiiiaiuuiiai?_r=1&_t=ZS-96VphjVQ4Pt" target="_blank" class="tiktok-btn">TikTok</a>
            <a href="https://www.linkedin.com/in/salman-andreas-1aa7173a7" target="_blank" class="linkedin-btn">LinkedIn</a>
          </div>
        </div>
      </div>

      <p class="bio">{{ displayedBio }}<span class="cursor">|</span></p>

      <div class="section fade-in" style="animation-delay:0.1s">
        <h3>🤖 Bots & AI</h3>
        <div class="item-list">
          <div class="item hover-glow">KontenAI — Telegram bot content creation (Groq + Pollinations.ai + Gemini)</div>
          <a href="https://salman0812.github.io/FraudDetection-ByMe/" target="_blank" class="item link hover-glow">Fraud Detection — ML project deteksi transaksi mencurigakan</a>
          <div class="item hover-glow">SalmanHelper — Google Gemini Gem dengan 5 modul akademik</div>
        </div>
      </div>

      <div class="section fade-in" style="animation-delay:0.2s">
        <h3>🌐 Web Apps</h3>
        <div class="item-list">
          <a href="https://mesintugas.vercel.app" target="_blank" class="item link hover-glow">Mesin Tugas UT — AI academic assistant (Next.js + FastAPI + Groq)</a>
          <a href="https://chuangku.vercel.app/" target="_blank" class="item link hover-glow">Chuàng Kù (创库) — Digital marketplace + Telegram bot</a>
          <a href="https://businessanalytic.vercel.app" target="_blank" class="item link hover-glow">Business Analytic AI — Dashboard analitik berbasis AI</a>
          <a href="https://cliniqu.vercel.app/" target="_blank" class="item link hover-glow">ClinIQ — Medical analytics app</a>
          <a href="https://salman0812.github.io/CodingCamp-30Mar26-salman/" target="_blank" class="item link hover-glow">Expense & Budget Visualizer — Budget tracker</a>
        </div>
      </div>

      <div class="section fade-in" style="animation-delay:0.3s">
        <h3>🛠 Tech Stack</h3>
        <div class="tags">
          <span v-for="t in techStack" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>

      <div class="section fade-in" style="animation-delay:0.4s">
        <h3>🏆 Certificates</h3>
        <div class="item-list">
          <div class="item cert-item" v-for="c in certs" :key="c">{{ c }}</div>
        </div>
      </div>

      <div class="built-with">
        <span>要 Kaname — Built by Salman · 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits(['close'])

const techStack = ['Python', 'JavaScript', 'TypeScript', 'Next.js', 'FastAPI', 'Supabase', 'Groq', 'Git', 'Kali Linux', 'Claude']
const certs = [
  'RevoU Applied AI',
  'Microsoft Elevate (Generative AI & ML)',
  'Dicoding METC (Microsoft Fabric + Azure Gen AI)',
  'DBS Coding Camp AI Engineer Track'
]

const fullBio = 'Mahasiswa aktif Universitas Terbuka (UPBJJ Jakarta Barat) yang passionate di bidang AI Engineering, Web Development, dan Cybersecurity.'
const displayedBio = ref('')
let charIndex = 0
let typing = true
let timer = null

function typeBio() {
  if (typing) {
    if (charIndex < fullBio.length) {
      displayedBio.value += fullBio[charIndex]
      charIndex++
      timer = setTimeout(typeBio, 45)
    } else {
      typing = false
      timer = setTimeout(typeBio, 2500)
    }
  } else {
    displayedBio.value = ''
    charIndex = 0
    typing = true
    timer = setTimeout(typeBio, 400)
  }
}

onMounted(() => { timer = setTimeout(typeBio, 600) })
onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: flex-end; justify-content: center; z-index: 300; }
.about-modal { width: 100%; max-width: 480px; background: var(--bg2); border-radius: 20px 20px 0 0; padding: 24px 20px 40px; max-height: 88vh; overflow-y: auto; position: relative; }
.close-btn { position: absolute; top: 16px; right: 16px; background: var(--bg3); border: none; color: var(--text); width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
.close-btn:hover { transform: rotate(90deg); }

.profile-section { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.avatar-img { width: 90px; height: 110px; border-radius: 14px; object-fit: cover; object-position: top center; border: 2px solid var(--accent); box-shadow: 0 0 16px rgba(201,169,110,0.3); }

.profile-info h2 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.role { font-size: 11px; color: var(--muted); line-height: 1.5; margin-bottom: 8px; }
.social-links { display: flex; gap: 8px; }

.name-anim {
  background: linear-gradient(90deg, #c9a96e, #e8c99a, #1a7abf, #c0392b, #c9a96e);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: nameColor 6s ease infinite;
}
@keyframes nameColor {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.tiktok-btn {
  font-size: 11px; padding: 4px 10px; border-radius: 20px;
  background: var(--bg3); border: 1px solid var(--border);
  text-decoration: none; font-weight: 600;
  background: linear-gradient(90deg, #69C9D0, #EE1D52, #69C9D0);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: tiktokColor 4s ease infinite;
  border: 1px solid #EE1D52;
}
@keyframes tiktokColor {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.linkedin-btn {
  font-size: 11px; padding: 4px 10px; border-radius: 20px;
  background: var(--bg3); border: 1px solid #0077b5;
  color: #0077b5; text-decoration: none; font-weight: 600;
  animation: linkedinPulse 2s ease-in-out infinite;
}
@keyframes linkedinPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,119,181,0); }
  50% { transform: scale(1.05); box-shadow: 0 0 8px rgba(0,119,181,0.5); }
}

.bio { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); min-height: 60px; }
.cursor { animation: blink 0.8s infinite; color: var(--accent); font-weight: 300; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.section { margin-bottom: 18px; }
.section h3 { font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--accent2); }
.item-list { display: flex; flex-direction: column; gap: 6px; }
.item { font-size: 12px; color: var(--muted); padding: 8px 12px; background: var(--bg3); border-radius: 8px; line-height: 1.4; transition: all 0.3s; border: 1px solid transparent; }
.item.link { color: var(--accent); text-decoration: none; display: block; }
.hover-glow:hover { border-color: var(--accent); box-shadow: 0 0 8px rgba(201,169,110,0.2); transform: translateX(4px); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 11px; padding: 4px 10px; background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3); border-radius: 20px; color: var(--accent); transition: all 0.3s; }
.tag:hover { background: rgba(201,169,110,0.25); transform: scale(1.05); }

.cert-item { position: relative; overflow: hidden; }
.cert-item::after { content: '✓'; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--accent); font-size: 12px; opacity: 0.6; }

.fade-in { animation: fadeInUp 0.5s ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.built-with { text-align: center; margin-top: 24px; font-size: 12px; color: var(--muted); padding-top: 16px; border-top: 1px solid var(--border); }
</style>
