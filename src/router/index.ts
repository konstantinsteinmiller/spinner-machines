import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import useUser, { isWeb } from '@/use/useUser'
import { isDebug } from '@/use/useMatch.ts'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/stage' },
  { path: '/stage', name: 'stage', component: () => import('@/views/StageView.vue') },
  { path: '/editor', name: 'editor', component: () => import('@/views/StageEditor.vue') },
  { path: '/battle', name: 'battle', component: () => import('@/views/SpinnerArena.vue') },
  { path: '/arena', name: 'arena', component: () => import('@/views/SpinnerArena.vue') }
  // ...isDebug.value ? [
  //   { path: '/crit-test', name: 'crit-test', component: () => import('@/views/CritTestScene.vue') },
  //   { path: '/power-up', name: 'power-up', component: () => import('@/views/PowerupTestScene.vue') },
  //   { path: '/trailer', name: 'trailer', component: () => import('@/views/TrailerScene.vue') }
  // ] : []
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

const remoteURL = import.meta.env.VITE_APP_REMOTE_URL
// --- THE ROUTER HOOK ---
router.beforeEach((to, from) => {
  const { userUnlocked, setSettingValue } = useUser()

  const url = window.location.href
  const storedUnlock: string = (localStorage.getItem('full_unlocked') as string)
  const parsedStoredUnlock: boolean = typeof storedUnlock === 'string' && storedUnlock?.length ? (JSON.parse(storedUnlock) as boolean) : false
  const isUnlocked = to.query.unlock === 'true' || to.query.unlocked === 'true' || from.query.unlocked === 'true' || parsedStoredUnlock === true

  // Only apply restrictions if it's the Web version
  if (isWeb) {
    const isFullVersion = url.includes(remoteURL + '/spinner-machines/') && !url.includes('/spinner-machines/demo/') && !url.includes('/spinner-machines/develop/')
    const isDevelopVersion = url.includes(remoteURL + '/spinner-machines/develop/')
    const isDev = url.includes('localhost:5173/')

    if (isDev) {
      return true
    }

    // If user is on Full or Develop without the unlock param, boot them to Demo
    if ((isFullVersion || isDevelopVersion) && !isUnlocked) {
      window.location.href = remoteURL + '/spinner-machines/demo/'
      return false// Stop execution
    } else if (isUnlocked && (isFullVersion || isDevelopVersion)) {
      localStorage.setItem('full_unlocked', 'true')
    }
  }

  return true
})

export default router
