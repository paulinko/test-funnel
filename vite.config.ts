import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => { // Destructure 'command' from the config object
  const REPO_NAME = "test-funnel"; // Define your repository name

  return {
    base: command === 'build' ? `/${REPO_NAME}/` : '/', // Conditionally set base path
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [dyadComponentTagger(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});