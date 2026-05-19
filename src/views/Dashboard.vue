<template>
  <div class="app">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <span>Kaname</span><span class="kanji">要</span>
      </div>
      <nav class="sidebar-nav">
        <button :class="{ active: tab === 'dashboard' }" @click="tab = 'dashboard'; sidebarOpen = false">
          📊 Dashboard
        </button>
        <button :class="{ active: tab === 'transactions' }" @click="tab = 'transactions'; sidebarOpen = false">
          💴 Transactions
        </button>
        <button :class="{ active: tab === 'ai' }" @click="tab = 'ai'; sidebarOpen = false">
          🤖 AI Assistant
        </button>
      </nav>
      <div class="sidebar-user">
        <div class="user-info">
          <div class="avatar">{{ auth.user?.name?.[0] }}</div>
          <div>
            <div class="user-name">{{ auth.user?.name }}</div>
            <div class="user-email">{{ auth.user?.email }}</div>
          </div>
        </div>
        <button class="btn-ghost logout" @click="handleLogout">Logout</button>
      </div>
    </aside>

    <!-- Overlay -->
    <div class="overlay" v-if="sidebarOpen" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">
        <button class="hamburger" @click="sidebarOpen = !sidebarOpen">☰</button>
        <div class="month-nav">
          <button class="btn-ghost sm" @click="prevMonth">‹</button>
          <span>{{ monthName }} {{ currentYear }}</span>
          <button class="btn-ghost sm" @click="nextMonth">›</button>
        </div>
        <div class="currency-switch">
          <button :class="{ active: currency === 'IDR' }" @click="currency = 'IDR'">IDR</button>
          <button :class="{ active: currency === 'JPY' }" @click="currency = 'JPY'">JPY</button>
        </div>
      </div>

      <!-- DASHBOARD TAB -->
      <div v-if="tab === 'dashboard'" class="tab-content fade-up">
        <!-- Summary Cards -->
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
            <div class="s-value" :class="summary.balance >= 0 ? 'green' : 'red'">
              {{ fmt(summary.balance) }}
            </div>
          </div>
          <div class="card summary-card">
            <div class="s-label">Transactions</div>
            <div class="s-value">{{ summary.transaction_count || 0 }}</div>
          </div>
        </div>

        <!-- Chart + Categories -->
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
                <span class="cat-amt">{{ fmt(amt) }}</span>
              </div>
              <div v-if="!Object.keys(summary.by_category || {}).length" class="empty">No expenses yet</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TRANSACTIONS TAB -->
      <div v-if="tab === 'transactions'" class="tab-content fade-up">
        <!-- Add Transaction Form -->
        <div class="card add-form">
          <h3>Add Transaction</h3>
          <div class="form-grid">
            <input v-model="form.name" placeholder="Item name (e.g. Ramen)" />
            <input v-model="form.amount" type="number" placeholder="Amount" />
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

        <!-- Sort + List -->
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
              <div class="bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <div class="ai-input-row">
            <input v-model="aiInput" placeholder="Ask Kaname..." @keyup.enter="sendAI" />
            <button class="btn-primary send-btn" @click="sendAI" :disabled="aiLoading">→</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Salary Modal -->
    <div class="modal-overlay" v-if="showSalaryModal" @click.self="showSalaryModal = false">
      <div class="modal card fade-up">
        <h3>Set Monthly Salary</h3>
        <input v-model="salaryInput" type="number" placeholder="e.g. 5000000" style="margin-top:12px" />
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import api from '../api'

ChartJS.register(ArcElement, Tooltip, Legend)

const auth = useAuthStore()
const router = useRouter()
const tab = ref('dashboard')
const sidebarOpen = ref(false)
const currency = ref('IDR')
const currentMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())
const summary = ref({ salary: 0, total_expense: 0, total_income: 0, balance: 0, by_category: {}, transaction_count: 0 })
const transactions = ref([])
const categories = ref([])
const sortBy = ref('default')
const form = ref({ name: '', amount: '', type: 'expense', category: '', currency: 'IDR', date: new Date().toISOString().split('T')[0], note: '' })
const newCat = ref('')
const txLoading = ref(false)
const showSalaryModal = ref(false)
const salaryInput = ref('')
const salaryCurrency = ref('IDR')
const aiInput = ref('')
const messages = ref([])
const aiLoading = ref(false)
const msgBox = ref(null)

const suggestions = [
  'How am I doing this month?',
  'Give me savings tips',
  'Analyze my spending',
  'How to save more from my salary?'
]

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthName = computed(() => monthNames[currentMonth.value - 1])

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

const COLORS = ['#ef4444','#3b82f6','#8b5cf6','#f59e0b','#ec4899','#10b981','#06b6d4','#6b7280','#c9a96e','#22c55e']
const chartData = computed(() => {
  const cats = Object.keys(summary.value.by_category || {})
  return {
    labels: cats,
    datasets: [{ data: cats.map(c => summary.value.by_category[c]), backgroundColor: COLORS.slice(0, cats.length), borderWidth: 0 }]
  }
})
const chartOptions = { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#f0ece4', font: { family: 'Outfit' } } } } }

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
  } catch (e) { console.error(e) }
}

async function addTransaction() {
  if (!form.value.name || !form.value.amount || !form.value.category) return
  txLoading.value = true
  try {
    await api.post('/transactions', { ...form.value, amount: parseFloat(form.value.amount) })
    form.value = { name: '', amount: '', type: 'expense', category: '', currency: 'IDR', date: new Date().toISOString().split('T')[0], note: '' }
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

function handleLogout() { auth.logout(); router.push('/login') }

onMounted(loadData)
</script>

<style scoped>
.app { display: flex; min-height: 100vh; background: var(--bg); }

.sidebar {
  width: 240px; min-height: 100vh;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 24px 16px;
  position: fixed; left: 0; top: 0; z-index: 100;
  transition: transform 0.3s;
}
.sidebar-logo { font-size: 22px; font-weight: 800; display: flex; align-items: center; gap: 8px; padding: 0 8px 24px; }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.sidebar-nav button { text-align: left; padding: 12px 16px; border-radius: 10px; background: none; color: var(--muted); font-size: 14px; font-weight: 500; transition: all 0.2s; }
.sidebar-nav button:hover, .sidebar-nav button.active { background: rgba(201,169,110,0.1); color: var(--accent); }
.sidebar-user { border-top: 1px solid var(--border); padding-top: 16px; }
.user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #0a0a0f; font-size: 14px; }
.user-name { font-size: 13px; font-weight: 600; }
.user-email { font-size: 11px; color: var(--muted); }
.logout { width: 100%; text-align: center; }

.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }

.main { margin-left: 240px; flex: 1; padding: 0 0 40px; min-height: 100vh; }

.topbar { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-bottom: 1px solid var(--border); background: var(--bg2); position: sticky; top: 0; z-index: 10; }
.hamburger { display: none; background: none; color: var(--text); font-size: 20px; padding: 4px 8px; }
.month-nav { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; flex: 1; justify-content: center; }
.btn-ghost.sm { padding: 6px 12px; font-size: 16px; }
.currency-switch { display: flex; gap: 4px; }
.currency-switch button { padding: 6px 12px; border-radius: 8px; background: none; border: 1px solid var(--border); color: var(--muted); font-size: 12px; font-weight: 600; }
.currency-switch button.active { background: var(--accent); color: #0a0a0f; border-color: var(--accent); }

.tab-content { padding: 24px; }

.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
.summary-card { position: relative; }
.s-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.s-value { font-size: 22px; font-weight: 700; }
.green { color: var(--green); }
.red { color: var(--red); }
.edit-salary { position: absolute; top: 16px; right: 16px; background: none; border: 1px solid var(--border); color: var(--muted); padding: 4px 10px; font-size: 11px; border-radius: 6px; }
.edit-salary:hover { border-color: var(--accent); color: var(--accent); }

.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.chart-wrap { margin-top: 12px; max-width: 240px; margin-left: auto; margin-right: auto; }
.empty-chart { text-align: center; color: var(--muted); padding: 40px 0; font-size: 13px; }
.cat-list { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
.cat-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.cat-name { color: var(--muted); }
.cat-amt { font-weight: 600; }

.add-form h3, .list-header h3 { margin-bottom: 16px; font-size: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.custom-cat-row { display: flex; gap: 8px; margin-top: 8px; }
.custom-cat-row input { flex: 1; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.tx-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
.tx-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg3); border-radius: 10px; }
.tx-name { font-size: 14px; font-weight: 600; }
.tx-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
.tx-right { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; }
.del-btn { background: rgba(239,68,68,0.15); color: var(--red); border: none; width: 28px; height: 28px; border-radius: 6px; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.del-btn:hover { background: var(--red); color: white; }
.empty { text-align: center; color: var(--muted); font-size: 13px; padding: 24px 0; }

.ai-card { display: flex; flex-direction: column; height: calc(100vh - 140px); }
.ai-header { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.ai-title { display: flex; align-items: center; gap: 12px; }
.ai-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 4px; }
.ai-welcome { text-align: center; padding: 32px 16px; color: var(--muted); line-height: 1.8; }
.suggestions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
.suggest-btn { padding: 8px 14px; border-radius: 20px; background: var(--bg3); border: 1px solid var(--border); color: var(--text); font-size: 12px; }
.suggest-btn:hover { border-color: var(--accent); color: var(--accent); }
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.msg.assistant { justify-content: flex-start; }
.bubble { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
.msg.user .bubble { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #0a0a0f; border-bottom-right-radius: 4px; }
.msg.assistant .bubble { background: var(--bg3); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
.typing { display: flex; gap: 4px; align-items: center; padding: 16px; }
.typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce 1s infinite; }
.typing span:nth-child(2) { animation-delay: 0.15s; }
.typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
.ai-input-row { display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
.send-btn { width: 48px; padding: 0; flex-shrink: 0; font-size: 18px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal { width: 100%; max-width: 360px; }
.modal h3 { font-size: 16px; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; }
  .hamburger { display: block; }
  .summary-grid { grid-template-columns: 1fr 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
