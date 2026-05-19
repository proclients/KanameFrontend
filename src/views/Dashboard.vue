<template>
  <div class="app">
    <!-- Main -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-logo">
          <span>Kaname</span><span class="kanji">要</span>
        </div>
        <div class="month-nav">
          <button class="btn-ghost sm" @click="prevMonth">‹</button>
          <span>{{ monthName }} {{ currentYear }}</span>
          <button class="btn-ghost sm" @click="nextMonth">›</button>
        </div>
        <div class="topbar-right">
          <div class="currency-switch">
            <button :class="{ active: currency === 'IDR' }" @click="currency = 'IDR'">IDR</button>
            <button :class="{ active: currency === 'JPY' }" @click="currency = 'JPY'">JPY</button>
          </div>
          <div class="avatar" @click.stop="showUserMenu = !showUserMenu">{{ auth.user?.name?.[0] }}</div>
          <div class="user-menu" v-if="showUserMenu">
            <div class="um-name">{{ auth.user?.name }}</div>
            <div class="um-email">{{ auth.user?.email }}</div>
            <button class="um-logout" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>

      <!-- DASHBOARD TAB -->
      <div v-if="tab === 'dashboard'" class="tab-content fade-up">
        <div class="summary-grid">
          <div class="card summary-card">
            <div class="s-label">Monthly Salary</div>
            <div class="s-value green">{{ fmt(summary.salary) }}</div>
            <button class="edit-salary" @click="showSalaryModal = true">Edit</button>
          </div>
          <div class="card summary-card">
            <div class="s-label">Total Expenses</div>
            <div class="s-value red">{{ fmt(summary.total_expense) }}</div>
          </div>
          <div class="card summary-card">
            <div class="s-label">Balance</div>
            <div class="s-value" :class="summary.balance >= 0 ? 'green' : 'red'">{{ fmt(summary.balance) }}</div>
          </div>
          <div class="card summary-card">
            <div class="s-label">Transactions</div>
            <div class="s-value">{{ summary.transaction_count || 0 }}</div>
          </div>
        </div>

        <!-- Warning bar -->
        <div class="warning-bar" v-if="summary.salary > 0 && (summary.salary - summary.total_expense) <= 200000">
          ⚠️ Pengeluaran sudah {{ Math.round((summary.total_expense / summary.salary) * 100) }}% dari gaji!
        </div>

        <div class="bottom-grid">
          <div class="card chart-card">
            <h3>Spending by Category</h3>
            <div class="chart-wrap">
              <Pie v-if="chartData.labels?.length" :data="chartData" :options="chartOptions" />
              <div v-else class="empty-chart">No data yet</div>
            </div>
          </div>
          <div class="card">
            <h3>Category Breakdown</h3>
            <div class="cat-list">
              <div v-for="(amt, cat) in summary.by_category" :key="cat" class="cat-item">
                <span class="cat-name">{{ cat }}</span>
                <div class="cat-right">
                  <span class="cat-pct" v-if="summary.salary > 0">{{ Math.round((amt/summary.salary)*100) }}%</span>
                  <span class="cat-amt">{{ fmt(amt) }}</span>
                </div>
              </div>
              <div v-if="!Object.keys(summary.by_category || {}).length" class="empty">No expenses yet</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TRANSACTIONS TAB -->
      <div v-if="tab === 'transactions'" class="tab-content fade-up">
        <div class="card add-form">
          <h3>Add Transaction</h3>
          <div class="form-grid">
            <input v-model="form.name" placeholder="Item name (e.g. Ramen)" />
            <input
              :value="displayAmount"
              type="text"
              placeholder="Amount"
              @input="onAmountInput"
              inputmode="numeric"
            />
            <select v-model="form.type">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select v-model="form.category">
              <option value="">-- Select Category --</option>
              <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
            </select>
            <select v-model="form.currency">
              <option value="IDR">IDR (Rp)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
            <input v-model="form.date" type="date" />
          </div>
          <div class="custom-cat-row">
            <input v-model="newCat" placeholder="New category name" />
            <button class="btn-ghost" @click="addCategory">+ Add</button>
          </div>
          <input v-model="form.note" placeholder="Note (optional)" style="margin-top:8px" />
          <button class="btn-primary" style="margin-top:12px" @click="addTransaction" :disabled="txLoading">
            {{ txLoading ? 'Adding...' : 'Add Transaction' }}
          </button>
        </div>

        <div class="card" style="margin-top:16px">
          <div class="list-header">
            <h3>Transactions — {{ monthName }} {{ currentYear }}</h3>
            <select v-model="sortBy" style="width:auto;padding:8px 12px">
              <option value="default">Default</option>
              <option value="amount-asc">Amount ↑</option>
              <option value="amount-desc">Amount ↓</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div class="tx-list">
            <div v-for="tx in sortedTransactions" :key="tx.id" class="tx-item">
              <div class="tx-left">
                <div class="tx-name">{{ tx.name }}</div>
                <div class="tx-meta">{{ tx.category }} · {{ tx.date }}</div>
              </div>
              <div class="tx-right">
                <span :class="tx.type === 'income' ? 'green' : 'red'">
                  {{ tx.type === 'income' ? '+' : '-' }}{{ fmtCurrency(tx.amount, tx.currency) }}
                </span>
                <button class="del-btn" @click="deleteTransaction(tx.id)">×</button>
              </div>
            </div>
            <div v-if="!transactions.length" class="empty">No transactions this month</div>
          </div>
        </div>
      </div>

      <!-- AI TAB -->
      <div v-if="tab === 'ai'" class="tab-content fade-up">
        <div class="card ai-card">
          <div class="ai-header">
            <div class="ai-title">
              <span class="kanji" style="font-size:28px">要</span>
              <div>
                <div style="font-weight:700;font-size:16px">Kaname AI</div>
                <div style="font-size:12px;color:var(--muted)">Your personal finance advisor</div>
              </div>
            </div>
          </div>
          <div class="ai-messages" ref="msgBox">
            <div v-if="!messages.length" class="ai-welcome">
              <p>こんにちは！ I'm Kaname, your personal finance AI.</p>
              <p>Ask me anything about your finances, savings tips, or budgeting advice.</p>
              <div class="suggestions">
                <button class="suggest-btn" v-for="s in suggestions" :key="s" @click="sendSuggestion(s)">{{ s }}</button>
              </div>
            </div>
            <div v-for="(msg, i) in messages" :key="i" :class="['msg', msg.role]">
              <div class="bubble">{{ msg.content }}</div>
            </div>
            <div v-if="aiLoading" class="msg assistant">
              <div class="bubble typing"><span></span><span></span><span></span></div>
            </div>
          </div>
          <div class="ai-input-row">
            <input v-model="aiInput" placeholder="Ask Kaname..." @keyup.enter="sendAI" />
            <button class="btn-primary send-btn" @click="sendAI" :disabled="aiLoading">→</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Nav -->
    <nav class="bottom-nav">
      <button :class="{ active: tab === 'dashboard' }" @click="tab = 'dashboard'">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Dashboard</span>
      </button>
      <button :class="{ active: tab === 'transactions' }" @click="tab = 'transactions'">
        <span class="nav-icon">💴</span>
        <span class="nav-label">Transactions</span>
      </button>
      <button :class="{ active: tab === 'ai' }" @click="tab = 'ai'">
        <span class="nav-icon">🤖</span>
        <span class="nav-label">AI</span>
      </button>
    </nav>

    <!-- Salary Modal -->
    <div class="modal-overlay" v-if="showSalaryModal" @click.self="showSalaryModal = false">
      <div class="modal card fade-up">
        <h3>Set Monthly Salary</h3>
              <input :value="displaySalary" type="text" placeholder="e.g. 5.000.000" @input="onSalaryInput" inputmode="numeric" style="margin-top:12px" />
        <select v-model="salaryCurrency" style="margin-top:8px">
          <option value="IDR">IDR (Rupiah)</option>
          <option value="JPY">JPY (Yen)</option>
        </select>
        <button class="btn-primary" style="margin-top:12px" @click="saveSalary">Save</button>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '../api'

ChartJS.register(ArcElement, Tooltip, Legend)

const auth = useAuthStore()
const router = useRouter()
const tab = ref('dashboard')
const currency = ref('IDR')
const showUserMenu = ref(false)
const currentMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())
const summary = ref({ salary: 0, total_expense: 0, total_income: 0, balance: 0, by_category: {}, transaction_count: 0 })
const transactions = ref([])
const categories = ref([])
const sortBy = ref('default')
const form = ref({ name: '', amount: 0, type: 'expense', category: '', currency: 'IDR', date: new Date().toISOString().split('T')[0], note: '' })
const displayAmount = ref('')
const newCat = ref('')
const txLoading = ref(false)
const showSalaryModal = ref(false)
const salaryInput = ref('')
const displaySalary = ref('')
const salaryCurrency = ref('IDR')
const aiInput = ref('')
const messages = ref([])
const aiLoading = ref(false)
const msgBox = ref(null)

const suggestions = [
  'Analyze my spending',
  'Tips hemat uang bulan ini',
  'Bagaimana kondisi keuangan saya?',
  'How to save more from my salary?'
]

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthName = computed(() => monthNames[currentMonth.value - 1])

function onSalaryInput(e) {
  const raw = e.target.value.replace(/\D/g, '')
  salaryInput.value = raw
  displaySalary.value = raw ? parseInt(raw).toLocaleString('id-ID') : ''
}

function onAmountInput(e) {
  const raw = e.target.value.replace(/\D/g, '')
  form.value.amount = parseFloat(raw) || 0
  displayAmount.value = raw ? parseInt(raw).toLocaleString('id-ID') : ''
}

function fmt(n) {
  const amount = n || 0
  if (currency.value === 'JPY') return '¥' + Math.round(amount / 150).toLocaleString()
  return 'Rp ' + amount.toLocaleString('id-ID')
}

function fmtCurrency(amount, cur) {
  if (cur === 'JPY') return '¥' + amount.toLocaleString()
  return 'Rp ' + amount.toLocaleString('id-ID')
}

const sortedTransactions = computed(() => {
  let list = [...transactions.value]
  if (sortBy.value === 'amount-asc') list.sort((a, b) => a.amount - b.amount)
  else if (sortBy.value === 'amount-desc') list.sort((a, b) => b.amount - a.amount)
  else if (sortBy.value === 'category') list.sort((a, b) => a.category.localeCompare(b.category))
  return list
})

const COLORS = ['#c0392b','#d4ac0d','#1a7abf','#ca6f1e','#1e8449','#76448a','#148f77','#d35400','#c9a96e','#922b21']
const chartData = computed(() => {
  const cats = Object.keys(summary.value.by_category || {})
  return {
    labels: cats,
    datasets: [{ data: cats.map(c => summary.value.by_category[c]), backgroundColor: COLORS.slice(0, cats.length), borderWidth: 0 }]
  }
})
const chartOptions = { responsive: true, cutout: '0%', plugins: { legend: { position: 'bottom', labels: { color: '#f0ece4', font: { family: 'Outfit', size: 11 }, padding: 6, boxWidth: 10 } }, tooltip: { callbacks: { label: (ctx) => { const total = ctx.dataset.data.reduce((a,b) => a+b, 0); const pct = Math.round((ctx.parsed/total)*100); return ' ' + ctx.label + ': ' + pct + '%'; } } } } }

function prevMonth() {
  if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value-- }
  else currentMonth.value--
  loadData()
}
function nextMonth() {
  if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++ }
  else currentMonth.value++
  loadData()
}

async function loadData() {
  try {
    const [sumRes, txRes, catRes] = await Promise.all([
      api.get(`/summary?month=${currentMonth.value}&year=${currentYear.value}`),
      api.get(`/transactions?month=${currentMonth.value}&year=${currentYear.value}`),
      api.get('/categories')
    ])
    summary.value = sumRes.data
    transactions.value = txRes.data
    categories.value = catRes.data
    salaryInput.value = sumRes.data.salary || ''
    displaySalary.value = sumRes.data.salary ? parseInt(sumRes.data.salary).toLocaleString('id-ID') : ''
  } catch (e) { console.error(e) }
}

async function addTransaction() {
  if (!form.value.name || !form.value.amount || !form.value.category) return
  txLoading.value = true
  try {
    await api.post('/transactions', { ...form.value })
    form.value = { name: '', amount: 0, type: 'expense', category: '', currency: 'IDR', date: new Date().toISOString().split('T')[0], note: '' }
    displayAmount.value = ''
    await loadData()
  } catch (e) { console.error(e) }
  txLoading.value = false
}

async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`)
  await loadData()
}

async function addCategory() {
  if (!newCat.value.trim()) return
  try {
    await api.post('/categories', { name: newCat.value.trim() })
    newCat.value = ''
    await loadData()
  } catch (e) { alert(e.response?.data?.detail || 'Error') }
}

async function saveSalary() {
  await api.post('/salary', { amount: parseFloat(salaryInput.value), currency: salaryCurrency.value, month: currentMonth.value, year: currentYear.value })
  showSalaryModal.value = false
  await loadData()
}

async function sendAI() {
  if (!aiInput.value.trim() || aiLoading.value) return
  const msg = aiInput.value.trim()
  messages.value.push({ role: 'user', content: msg })
  aiInput.value = ''
  aiLoading.value = true
  await nextTick()
  if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight
  try {
    const res = await api.post('/ai/chat', { message: msg, context: summary.value })
    messages.value.push({ role: 'assistant', content: res.data.reply })
  } catch (e) { messages.value.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }) }
  aiLoading.value = false
  await nextTick()
  if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight
}

function sendSuggestion(s) { aiInput.value = s; sendAI() }
function handleLogout() { auth.logout(); showUserMenu.value = false; window.location.replace('/login') }
onMounted(loadData)
</script>

<style scoped>
.app { display: flex; flex-direction: column; min-height: 100vh; background: var(--bg); }

.topbar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  position: sticky; top: 0; z-index: 10;
}
.topbar-logo { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
.month-nav { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; flex: 1; justify-content: center; }
.btn-ghost.sm { padding: 4px 10px; font-size: 16px; }
.topbar-right { display: flex; align-items: center; gap: 8px; position: relative; }
.currency-switch { display: flex; gap: 3px; }
.currency-switch button { padding: 5px 10px; border-radius: 8px; background: none; border: 1px solid var(--border); color: var(--muted); font-size: 11px; font-weight: 600; }
.currency-switch button.active { background: var(--accent); color: #0a0a0f; border-color: var(--accent); }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #0a0a0f; font-size: 13px; cursor: pointer; }
.user-menu { position: absolute; top: 40px; right: 0; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px; min-width: 180px; z-index: 999; }
.um-name { font-weight: 700; font-size: 13px; }
.um-email { font-size: 11px; color: var(--muted); margin-bottom: 10px; }
.um-logout { width: 100%; padding: 8px; background: rgba(239,68,68,0.1); color: var(--red); border: none; border-radius: 8px; font-size: 13px; cursor: pointer; }

.main { flex: 1; padding-bottom: 70px; }

.tab-content { padding: 16px; }

.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px; }
.summary-card { position: relative; }
.s-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.s-value { font-size: 20px; font-weight: 700; }
.green { color: var(--green); }
.red { color: var(--red); }
.edit-salary { position: absolute; top: 12px; right: 12px; background: none; border: 1px solid var(--border); color: var(--muted); padding: 3px 8px; font-size: 10px; border-radius: 6px; }

.warning-bar { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: var(--red); margin-bottom: 12px; font-weight: 600; }

.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: stretch; }
.chart-wrap { padding: 16px 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.empty-chart { text-align: center; color: var(--muted); padding: 32px 0; font-size: 13px; }
.cat-list { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.cat-item { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 12px; gap: 4px; } .cat-name { color: var(--muted); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .cat-amt { font-weight: 600; font-size: 11px; white-space: nowrap; }
.cat-right { display: flex; align-items: center; gap: 8px; }
.cat-pct { font-size: 11px; color: var(--accent); background: rgba(201,169,110,0.1); padding: 2px 6px; border-radius: 10px; }

.add-form h3 { margin-bottom: 14px; font-size: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.custom-cat-row { display: flex; gap: 8px; margin-top: 8px; }
.custom-cat-row input { flex: 1; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.list-header h3 { font-size: 14px; }
.tx-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
.tx-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg3); border-radius: 10px; }
.tx-name { font-size: 13px; font-weight: 600; }
.tx-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
.tx-right { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; }
.del-btn { background: rgba(239,68,68,0.15); color: var(--red); border: none; width: 26px; height: 26px; border-radius: 6px; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.ai-card { display: flex; flex-direction: column; height: calc(100vh - 150px); }
.ai-header { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.ai-title { display: flex; align-items: center; gap: 12px; }
.ai-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 2px; }
.ai-welcome { text-align: center; padding: 24px 12px; color: var(--muted); line-height: 1.8; font-size: 14px; }
.suggestions { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 12px; }
.suggest-btn { padding: 7px 12px; border-radius: 20px; background: var(--bg3); border: 1px solid var(--border); color: var(--text); font-size: 12px; cursor: pointer; }
.suggest-btn:hover { border-color: var(--accent); color: var(--accent); }
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.msg.assistant { justify-content: flex-start; }
.bubble { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
.msg.user .bubble { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #0a0a0f; border-bottom-right-radius: 4px; }
.msg.assistant .bubble { background: var(--bg3); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
.typing { display: flex; gap: 4px; align-items: center; padding: 14px; }
.typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce 1s infinite; }
.typing span:nth-child(2) { animation-delay: 0.15s; }
.typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
.ai-input-row { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
.send-btn { width: 44px; padding: 0; flex-shrink: 0; font-size: 16px; }

/* Bottom Nav */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--bg2);
  border-top: 1px solid var(--border);
  display: flex;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-nav button {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 10px 0; background: none; color: var(--muted);
  border-radius: 0; gap: 3px; transition: all 0.2s;
}
.bottom-nav button.active { color: var(--accent); }
.bottom-nav button.active .nav-icon { transform: translateY(-2px); }
.nav-icon { font-size: 20px; transition: transform 0.2s; }
.nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.3px; }

.overlay { position: fixed; inset: 0; z-index: 90; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal { width: 100%; max-width: 360px; }
.modal h3 { font-size: 16px; }
</style>
