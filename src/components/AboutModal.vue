<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="about-modal">
      <button class="close-btn" @click="$emit('close')">×</button>

      <div class="profile-section">
        <img src="https://raw.githubusercontent.com/proclients/KanameFrontend/main/public/IMG_20260520_142808.png" class="avatar-img" alt="Salman" />
        <div class="profile-info">
          <h2>Salman</h2>
          <p class="role">Mahasiswa Sistem Informasi | AI Engineer Track | Jakarta</p>
          <div class="social-links">
            <a href="https://www.tiktok.com/@uiiiaiuuiiai?_r=1&_t=ZS-96VphjVQ4Pt" target="_blank">TikTok</a>
            <a href="https://www.linkedin.com/in/salman-andreas-1aa7173a7" target="_blank">LinkedIn</a>
          </div>
        </div>
      </div>

      <p class="bio">Mahasiswa aktif Universitas Terbuka (UPBJJ Jakarta Barat) yang passionate di bidang AI Engineering, Web Development, dan Cybersecurity.</p>

      <div class="section">
        <h3>🤖 Bots & AI</h3>
        <div class="item-list">
          <div class="item">KontenAI — Telegram bot content creation (Groq + Pollinations.ai + Gemini)</div>
          <div class="item">SalmanHelper — Google Gemini Gem dengan 5 modul akademik</div>
          <div class="item">Fraud Detection — ML project deteksi transaksi mencurigakan</div>
        </div>
      </div>

      <div class="section">
        <h3>🌐 Web Apps</h3>
        <div class="item-list">
          <a href="https://mesintugas.vercel.app" target="_blank" class="item link">Mesin Tugas UT — AI academic assistant (Next.js + FastAPI + Groq)</a>
          <a href="https://chuangku.ricossh.cloud" target="_blank" class="item link">Chuàng Kù (创库) — Digital marketplace + Telegram bot</a>
          <a href="https://businessanalytic.vercel.app" target="_blank" class="item link">Business Analytic AI — Dashboard analitik berbasis AI</a>
          <a href="https://cliniqu.vercel.app" target="_blank" class="item link">ClinIQ — Medical analytics app</a>
          <a href="https://ricosh.cloud" target="_blank" class="item link">Expense & Budget Visualizer — Budget tracker</a>
        </div>
      </div>

      <div class="section">
        <h3>🛠 Tech Stack</h3>
        <div class="tags">
          <span v-for="t in techStack" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>

      <div class="section">
        <h3>🏆 Certificates</h3>
        <div class="item-list">
          <div class="item" v-for="c in certs" :key="c">{{ c }}</div>
        </div>
      </div>

      <div class="built-with">
        <span>要 Kaname — Built by Salman · 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])

const techStack = ['Python', 'JavaScript', 'TypeScript', 'Next.js', 'FastAPI', 'Supabase', 'Groq', 'Git', 'Kali Linux', 'Claude']
const certs = [
  'RevoU Applied AI',
  'Microsoft Elevate (Generative AI & ML)',
  'Dicoding METC (Microsoft Fabric + Azure Gen AI)',
  'DBS Coding Camp AI Engineer Track'
]
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: flex-end; justify-content: center; z-index: 300; }
.about-modal { width: 100%; max-width: 480px; background: var(--bg2); border-radius: 20px 20px 0 0; padding: 24px 20px 40px; max-height: 85vh; overflow-y: auto; position: relative; }
.close-btn { position: absolute; top: 16px; right: 16px; background: var(--bg3); border: none; color: var(--text); width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.profile-section { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
.avatar-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; object-position: top; border: 2px solid var(--accent); }
.profile-info h2 { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
.role { font-size: 11px; color: var(--muted); line-height: 1.5; margin-bottom: 8px; }
.social-links { display: flex; gap: 8px; }
.social-links a { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: var(--bg3); border: 1px solid var(--border); color: var(--accent); text-decoration: none; }

.bio { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }

.section { margin-bottom: 18px; }
.section h3 { font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--accent2); }
.item-list { display: flex; flex-direction: column; gap: 6px; }
.item { font-size: 12px; color: var(--muted); padding: 8px 12px; background: var(--bg3); border-radius: 8px; line-height: 1.4; }
.item.link { color: var(--accent); text-decoration: none; display: block; }
.item.link:hover { border: 1px solid var(--accent); }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 11px; padding: 4px 10px; background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3); border-radius: 20px; color: var(--accent); }

.built-with { text-align: center; margin-top: 24px; font-size: 12px; color: var(--muted); padding-top: 16px; border-top: 1px solid var(--border); }
</style>
