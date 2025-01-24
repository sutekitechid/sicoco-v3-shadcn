// vite.config.ts
import { defineConfig } from "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/node_modules/vite-plugin-dts/dist/index.mjs";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/node_modules/glob/dist/esm/index.js";
import { viteStaticCopy } from "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\udaff\\Desktop\\suteki-dev\\sicoco-v3-shadcn";
var __vite_injected_original_import_meta_url = "file:///C:/Users/udaff/Desktop/suteki-dev/sicoco-v3-shadcn/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({ include: ["lib"], insertTypesEntry: true }),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__vite_injected_original_dirname, "./lib/assets") + "/[!.]*",
          dest: "./assets"
        },
        {
          src: resolve(__vite_injected_original_dirname, "./lib/config") + "/*.css",
          dest: "./config"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./lib")
    }
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/main.ts"),
      formats: ["es"]
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["vue"],
      input: Object.fromEntries(
        glob.sync("lib/**/*.{ts,tsx}", {
          ignore: ["lib/**/*.d.ts"]
        }).map((file) => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative(
            "lib",
            file.slice(0, file.length - extname(file).length)
          ),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        preserveModules: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1ZGFmZlxcXFxEZXNrdG9wXFxcXHN1dGVraS1kZXZcXFxcc2ljb2NvLXYzLXNoYWRjblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdWRhZmZcXFxcRGVza3RvcFxcXFxzdXRla2ktZGV2XFxcXHNpY29jby12My1zaGFkY25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VkYWZmL0Rlc2t0b3Avc3V0ZWtpLWRldi9zaWNvY28tdjMtc2hhZGNuL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG4vLyBpbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tICd2aXRlLXBsdWdpbi1saWItaW5qZWN0LWNzcydcbmltcG9ydCB7IGV4dG5hbWUsIHJlbGF0aXZlLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJ1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSdcblxuLypcbiAgKiBUaGlzIGlzIGEgVml0ZSBjb25maWcgZmlsZS5cbiAgKiBJdCBpcyBhIE5vZGUuanMgbW9kdWxlIHRoYXQgZXhwb3J0cyBhbiBvYmplY3QuXG4gICogaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbiAgKiBcbiAgKiBXZSBkZWNpZGUgbm90IHRvIGV4cG9ydCBjc3MgZmlsZXMgZ2VuZXJhdGVkIGJ5IHRhaWx3aW5kY3NzXG4gICogVGhlIHVzZXIgbXVzdCBpbmNsdWRlIHRoaXMgcGFja2FnZSBpbnRvIHRoZWlyIHRhaWx3aW5kLmNvbmZpZy5qcyBjb250ZW50LlxuICAqL1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBkdHMoeyBpbmNsdWRlOiBbJ2xpYiddLCBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlIH0pLFxuICAgIHZpdGVTdGF0aWNDb3B5KHtcbiAgICAgIHRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL2xpYi9hc3NldHMnKSArICcvWyEuXSonLFxuICAgICAgICAgIGRlc3Q6ICcuL2Fzc2V0cycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9saWIvY29uZmlnJykgKyAnLyouY3NzJyxcbiAgICAgICAgICBkZXN0OiAnLi9jb25maWcnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9saWJcIiksXG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnbGliL21haW4udHMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXVxuICAgIH0sXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sXG4gICAgICBpbnB1dDogT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBnbG9iLnN5bmMoJ2xpYi8qKi8qLnt0cyx0c3h9Jywge1xuICAgICAgICAgIGlnbm9yZTogW1wibGliLyoqLyouZC50c1wiXSxcbiAgICAgICAgfSkubWFwKGZpbGUgPT4gW1xuICAgICAgICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBlbnRyeSBwb2ludFxuICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgICAgIHJlbGF0aXZlKFxuICAgICAgICAgICAgJ2xpYicsXG4gICAgICAgICAgICBmaWxlLnNsaWNlKDAsIGZpbGUubGVuZ3RoIC0gZXh0bmFtZShmaWxlKS5sZW5ndGgpXG4gICAgICAgICAgKSxcbiAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZW50cnkgZmlsZVxuICAgICAgICAgIC8vIGxpYi9uZXN0ZWQvZm9vLnRzIGJlY29tZXMgL3Byb2plY3QvbGliL25lc3RlZC9mb28udHNcbiAgICAgICAgICBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoZmlsZSwgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgICAgXSlcbiAgICAgICksXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdjaHVua3MvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXVtleHRuYW1lXScsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzOiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1YsU0FBUyxvQkFBb0I7QUFDalgsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUVoQixTQUFTLFNBQVMsVUFBVSxlQUFlO0FBQzNDLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsWUFBWTtBQUNyQixTQUFTLHNCQUFzQjtBQVAvQixJQUFNLG1DQUFtQztBQUE4SyxJQUFNLDJDQUEyQztBQW1CeFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLEtBQUssQ0FBQztBQUFBLElBQ2hELGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxLQUFLLFFBQVEsa0NBQVcsY0FBYyxJQUFJO0FBQUEsVUFDMUMsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLLFFBQVEsa0NBQVcsY0FBYyxJQUFJO0FBQUEsVUFDMUMsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBQ0EsZUFBZTtBQUFBLElBQ2YsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLEtBQUs7QUFBQSxNQUNoQixPQUFPLE9BQU87QUFBQSxRQUNaLEtBQUssS0FBSyxxQkFBcUI7QUFBQSxVQUM3QixRQUFRLENBQUMsZUFBZTtBQUFBLFFBQzFCLENBQUMsRUFBRSxJQUFJLFVBQVE7QUFBQTtBQUFBO0FBQUEsVUFHYjtBQUFBLFlBQ0U7QUFBQSxZQUNBLEtBQUssTUFBTSxHQUFHLEtBQUssU0FBUyxRQUFRLElBQUksRUFBRSxNQUFNO0FBQUEsVUFDbEQ7QUFBQTtBQUFBO0FBQUEsVUFHQSxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFBQSxRQUM5QyxDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
