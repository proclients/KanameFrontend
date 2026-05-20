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

      <div class="section">
        <h3 class="section-header">🤖 Bots & AI</h3>
        <div class="item-list">
          <div class="item slide-in hover-glow" style="animation-delay:0.05s">KontenAI — Telegram bot content creation (Groq + Pollinations.ai + Gemini)</div>
          <a href="https://salman0812.github.io/FraudDetection-ByMe/" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.1s">Fraud Detection — ML project deteksi transaksi mencurigakan</a>
          <div class="item slide-in hover-glow" style="animation-delay:0.15s">SalmanHelper — Google Gemini Gem dengan 5 modul akademik</div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-header">🌐 Web Apps</h3>
        <div class="item-list">
          <a href="https://mesintugas.vercel.app" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.05s">Mesin Tugas UT — AI academic assistant (Next.js + FastAPI + Groq)</a>
          <a href="https://chuangku.vercel.app/" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.1s">Chuàng Kù (创库) — Digital marketplace + Telegram bot</a>
          <a href="https://businessanalytic.vercel.app" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.15s">Business Analytic AI — Dashboard analitik berbasis AI</a>
          <a href="https://cliniqu.vercel.app/" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.2s">ClinIQ — Medical analytics app</a>
          <a href="https://salman0812.github.io/CodingCamp-30Mar26-salman/" target="_blank" class="item link slide-in hover-glow" style="animation-delay:0.25s">Expense & Budget Visualizer — Budget tracker</a>
        </div>
      </div>

      <div class="section">
        <h3 class="section-header">🛠 Tech Stack</h3>
        <div class="tags">
          <span v-for="(t, i) in techStack" :key="t" class="tag" :style="{ animationDelay: (i * 0.1) + 's' }">{{ t }}</span>
        </div>
      </div>

      <div class="section">
        <h3 class="section-header">🏆 Certificates</h3>
        <div class="item-list">
          <div class="item cert-item shimmer" v-for="(c, i) in certs" :key="c" :style="{ animationDelay: (i * 0.3) + 's' }">{{ c }}</div>
        </div>
      </div>

      <div class="built-with">
        <span class="built-text">要 Kaname — Built by Salman · 2026</span>
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
.close-btn { position: absolute; top: 16px; right: 16px; background: var(--bg3); border: none; color: var(--text); width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; }
.close-btn:hover { transform: rotate(90deg); }

.profile-section { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.avatar-img { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; object-position: center 0%; border: 2px solid var(--accent); box-shadow: 0 0 16px rgba(201,169,110,0.3); flex-shrink: 0; }

.profile-info h2 { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.role { font-size: 11px; color: var(--muted); line-height: 1.5; margin-bottom: 8px; }
.social-links { display: flex; gap: 8px; flex-wrap: wrap; }

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
  50% { transform: scale(1.06); box-shadow: 0 0 10px rgba(0,119,181,0.5); }
}

.bio { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); min-height: 60px; }
.cursor { animation: blink 0.8s infinite; color: var(--accent); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.section { margin-bottom: 18px; }

.section-header {
  font-size: 13px; font-weight: 700; margin-bottom: 10px;
  color: var(--accent2);
  animation: headerGlow 3s ease-in-out infinite;
}
@keyframes headerGlow {
  0%, 100% { text-shadow: 0 0 0px rgba(201,169,110,0); }
  50% { text-shadow: 0 0 8px rgba(201,169,110,0.6); }
}

.item-list { display: flex; flex-direction: column; gap: 6px; }
.item { font-size: 12px; color: var(--muted); padding: 8px 12px; background: var(--bg3); border-radius: 8px; line-height: 1.4; border: 1px solid transparent; transition: all 0.3s; }
.item.link { color: var(--accent); text-decoration: none; display: block; }

.slide-in { animation: slideIn 0.4s ease both; }
@keyframes slideIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }

.hover-glow:hover { border-color: var(--accent); box-shadow: 0 0 8px rgba(201,169,110,0.2); transform: translateX(4px); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-size: 11px; padding: 4px 10px;
  background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3);
  border-radius: 20px; color: var(--accent);
  animation: tagFloat 3s ease-in-out infinite;
  transition: all 0.3s;
}
.tag:hover { background: rgba(201,169,110,0.25); transform: scale(1.08); }
@keyframes tagFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.cert-item { position: relative; overflow: hidden; }
.cert-item::after { content: '✓'; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--accent); font-size: 12px; opacity: 0.6; }
.shimmer { position: relative; overflow: hidden; }
.shimmer::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent);
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }

.built-with { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }
.built-text { font-size: 12px; color: var(--muted); animation: breathe 4s ease-in-out infinite; display: inline-block; }
@keyframes breathe { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
</style>
