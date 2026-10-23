import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          navy: '#0F1B2D',       // Primary dark background
          charcoal: '#1A2332',   // Card backgrounds
          slate: '#243447',      // Elevated surfaces
          steel: '#2D3F52',      // Borders, dividers
        },
        accent: {
          blue: '#3B82F6',       // Primary accent (electric blue)
          'blue-light': '#60A5FA',
          'blue-dark': '#2563EB',
          silver: '#94A3B8',     // Secondary accent
          gold: '#F59E0B',       // Sale/discount badges
        },
        surface: {
          white: '#FFFFFF',
          cream: '#F8FAFC',      // Light page backgrounds
          light: '#F1F5F9',      // Card backgrounds (light mode sections)
          muted: '#E2E8F0',      // Borders in light sections
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
