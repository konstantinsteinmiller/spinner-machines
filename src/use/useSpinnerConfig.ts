import { ref, type Ref } from 'vue'

// ─── Minimal coin wallet state ──────────────────────────────────────────────
// Previous versions of this file held the whole PvP arena team config,
// upgrade tables and part catalogs. The stage game only needs the coin
// wallet + first-win flag, so the rest has been stripped.

const COINS_KEY = 'spinner_coins'
const FIRST_WIN_KEY = 'spinner_first_win'

function loadStoredCoins(): number {
  try {
    const raw = localStorage.getItem(COINS_KEY)
    if (!raw) return 0
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

const coins: Ref<number> = ref(loadStoredCoins())
const hasFirstWin: Ref<boolean> = ref(localStorage.getItem(FIRST_WIN_KEY) === '1')

const addCoins = (amount: number) => {
  coins.value += amount
  localStorage.setItem(COINS_KEY, coins.value.toString())
}

const markFirstWin = () => {
  hasFirstWin.value = true
  localStorage.setItem(FIRST_WIN_KEY, '1')
}

const useSpinnerConfig = () => ({
  coins,
  hasFirstWin,
  addCoins,
  markFirstWin
})

export default useSpinnerConfig
