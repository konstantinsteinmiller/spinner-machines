import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { writeFileSync } from 'node:fs'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' loads all env vars regardless of VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '')

  // Only obfuscate during a real production build — never during dev,
  // where the obfuscator rewrites dynamic import strings into lookups
  // Vite can no longer transform, breaking module specifiers at runtime.
  const isProduction = (mode === 'production' || env.VITE_NODE_ENV === 'production') && command === 'build'
  const shouldObfuscate = env.VITE_ENABLE_OBFUSCATION === 'true'

  // Initialize plugins array
  const plugins = []

  // Dev-only: POST /__save-stage writes a Stage JSON payload into
  // src/game/stages/<name>.ts so the editor can persist to core files
  // while running `pnpm dev`. Skipped for production builds.
  const stageWriter: Plugin = {
    name: 'bm-stage-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-stage', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('POST only')
          return
        }
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const payload = JSON.parse(body) as { name: string; stage: unknown }
            const safe = String(payload.name ?? '').replace(/[^a-zA-Z0-9_-]/g, '')
            if (!safe) {
              res.statusCode = 400
              res.end('bad name')
              return
            }
            const filePath = resolve(
              dirname(fileURLToPath(import.meta.url)),
              'src/game/stages',
              `${safe}.ts`
            )
            const code = `import type { Stage } from '@/types/stage'\n\n`
              + `const stage: Stage = ${JSON.stringify(payload.stage, null, 2)}\n\n`
              + `export default stage\n`
            writeFileSync(filePath, code, 'utf8')
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: filePath }))
          } catch (err) {
            res.statusCode = 500
            res.end(String(err))
          }
        })
      })
    }
  }
  plugins.push(stageWriter)

  // Only push the obfuscator if both conditions are met
  if (isProduction && shouldObfuscate) {
    console.log('--- 🛡️  Obfuscating Production Build ---')
    plugins.push(
      javascriptObfuscator({
        // Exclude files with dynamic imports — the obfuscator's stringArray
        // rewrites import paths into array lookups that Vite can no longer
        // resolve, which breaks code splitting.
        exclude: [
          /router\/index\.ts$/,
          /main\.ts$/,
          // i18n loader uses `import.meta.glob` for per-locale code
          // splitting — the obfuscator's stringArray rewrites those
          // dynamic paths so rollup can no longer produce separate
          // chunks (every locale ends up inlined in index.js).
          /i18n[\\/]index\.ts$/,
          // useAssets uses dynamic import() for stage resolution at boot;
          // stages/index.ts uses import.meta.glob for lazy stage loading.
          /use[\\/]useAssets\.ts$/,
          /game[\\/]stages[\\/]index\.ts$/
        ],
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          numbersToExpressions: true,
          simplify: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          splitStrings: true,
          unicodeEscapeSequence: true
        }
      } as any)
    )
  }

  // ─── CSP generation ────────────────────────────────────────────────
  // Whitelist of external hosts. Add new platforms here — they're
  // automatically applied to every relevant directive.
  const CSP_HOSTS = [
    'https://*.crazygames.com',
    'https://sdk.crazygames.com',
    'https://wavedash.com',
    'https://*.wavedash.com',
    'https://itch.io',
    'https://*.itch.io',
    'https://api.jsonbin.io'
  ]
  // Extra per-directive sources that don't follow the blanket host pattern.
  const CSP_EXTRA: Record<string, string[]> = {
    'script-src': [],
    'style-src': ['\'unsafe-inline\''],
    'img-src': ['data:'],
    'connect-src': [
      'https://*.sentry.io',
      'wss://*.wavedash.com',
      'wss://0.peerjs.com',
      'https://0.peerjs.com',
      'https://getpantry.cloud',
      'https://*.getpantry.cloud'
    ],
    'frame-src': [],
    'media-src': []
  }
  const cspDirectives = [
    'default-src', 'script-src', 'style-src', 'img-src',
    'connect-src', 'frame-src', 'media-src'
  ]
  const cspValue = cspDirectives.map(dir => {
    const extras = CSP_EXTRA[dir] ?? []
    return `${dir} 'self' ${CSP_HOSTS.join(' ')} ${extras.join(' ')}`.trim()
  }).join('; ')

  // Skip CSP injection for platforms that run inside a sandboxed iframe
  // (itch.io) — their own iframe sandbox handles security, and our CSP
  // conflicts with the cross-origin CDN hosting (itch.zone).
  const skipCsp = mode === 'itch'
  plugins.push({
    name: 'inject-csp',
    transformIndexHtml(html: string) {
      return html.replace(
        '<!-- CSP meta tag injected by vite.config.ts at build time -->',
        skipCsp ? '' : `<meta http-equiv="Content-Security-Policy" content="${cspValue}" />`
      )
    }
  })

  // Strip the CrazyGames SDK <script> tag from index.html for non-CrazyGames builds
  // so it doesn't block or error on other platforms (e.g. Wavedash).
  const isCrazyWeb = env.VITE_APP_CRAZY_WEB === 'true'
  if (!isCrazyWeb) {
    plugins.push({
      name: 'strip-crazygames-sdk',
      transformIndexHtml(html: string) {
        return html.replace(
          /<!-- Load the SDK before your game code -->\s*<script[^>]*sdk\.crazygames\.com[^>]*><\/script>\s*/,
          ''
        )
      }
    })
  }

  return {
    base: '/',
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    },
    plugins: [
      tailwindcss(),
      vue(),
      // vueDevTools(),
      VueI18nPlugin({
        // 1. Tell the plugin where your global translation files are
        include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),

        // 2. This allows you to use YAML in the <i18n> block
        // The plugin usually detects yaml automatically, but you can force
        // strict behavior if needed by ensuring the 'yaml' loader is available.
        defaultSFCLang: 'yaml'
      }),
      ...plugins
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@/': fileURLToPath(new URL('./src/', import.meta.url)),
        '#': fileURLToPath(new URL('./src/assets', import.meta.url))
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build: {
      minify: 'esbuild',
      // Disable source maps in production if you want maximum protection
      sourcemap: !shouldObfuscate,
      rollupOptions: {
        output: {
          // Pin the framework libs into their own long-lived chunk so
          // they stay cached across deploys that only touch game code.
          // Everything else falls back to rollup's automatic chunking.
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (
                id.includes('/vue/') ||
                id.includes('/vue-router/') ||
                id.includes('/vue-i18n/') ||
                id.includes('/@vue/') ||
                id.includes('/@intlify/')
              ) {
                return 'vendor-vue'
              }
              if (id.includes('/@vueuse/')) return 'vendor-vueuse'
              if (id.includes('/lodash')) return 'vendor-util'
            }
          }
        }
      }
    }
  }
})
