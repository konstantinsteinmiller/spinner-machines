/**
 * App-mode flag — distinguishes the "editor-mode" deployment from the
 * regular game build. Editor mode hides the game-loop chrome (skins,
 * stages, achievements, reward screen) and makes the stage editor the
 * default route.
 *
 * Detection sources (OR'd together):
 *   1. Build-time env var `VITE_APP_EDITOR_MODE=true` set by the
 *      editor-mode deployment pipeline.
 *   2. The current URL's path contains `/editor-mode` — this covers
 *      the `/spinner-machines/editor-mode` hosting target directly so
 *      the same build artifact could be served from either path.
 */

const envFlag = (import.meta.env.VITE_APP_EDITOR_MODE as string | undefined) === 'true'
const pathFlag =
  typeof window !== 'undefined' &&
  typeof window.location !== 'undefined' &&
  window.location.pathname.includes('/editor-mode')

export const isEditorMode = envFlag || pathFlag

const useAppMode = () => ({
  isEditorMode
})

export default useAppMode
