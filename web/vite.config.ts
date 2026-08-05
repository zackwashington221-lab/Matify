// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubPages = process.env.NITRO_PRESET === "github-pages";

export default defineConfig({
  // GitHub Pages only supports static files. In that environment, build a
  // pre-rendered SPA; all other builds retain the server-rendered app.
  tanstackStart: isGitHubPages
    ? {
        spa: {
          enabled: true,
          maskPath: "/Matify/",
          prerender: { outputPath: "/index.html" },
        },
      }
    : {
        // Redirect TanStack Start's bundled server entry to src/server.ts.
        server: { entry: "server" },
      },
  vite: {
    base: isGitHubPages ? "/Matify/" : "/",
  },
  nitro: isGitHubPages ? false : undefined,
});
