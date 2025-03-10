import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { viteStaticCopy } from "vite-plugin-static-copy"
import { dirname, join, resolve } from "path"
import { fileURLToPath } from "url"

const PYODIDE_EXCLUDE = [
  "!**/*.{md,html}",
  "!**/*.d.ts",
  "!**/*.whl",
  "!**/node_modules",
]

export function viteStaticCopyPyodide() {
  const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")))
  return viteStaticCopy({
    targets: [
      {
        src: [join(pyodideDir, "*")].concat(PYODIDE_EXCLUDE),
        dest: "assets",
      },
    ],
  })
}

export default defineConfig({
  optimizeDeps: { exclude: ["pyodide"] },
  plugins: [react(), viteStaticCopyPyodide()],
  resolve: {
    alias: {
      "@source_engine_cfg_parser": resolve(__dirname, "./source_engine_cfg_parser"),
    },
  },
  worker: {
    format: "es"
  }
})
