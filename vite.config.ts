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
          /i18n[\\/]index\.ts$/
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
      sourcemap: !shouldObfuscate
    }
  }
})
