import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: {
  //     key: "./server.key",
  //     cert: "./server.crt",
  //   },
  // },
});
