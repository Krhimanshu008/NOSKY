/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/app/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/ui/AdminSettingsIcon.jsx",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EAEAEA',
        surface: '#F5F5F5',
        panel: '#FFFFFF',
        ink: '#000000',
        muted: '#71717A',
        gridline: '#CCCCCC',
        accent: '#FF4B4B',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
