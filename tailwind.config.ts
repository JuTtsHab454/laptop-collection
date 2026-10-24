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
          dark: '#07090E',        // Deepest Obsidian Velvet
          navy: '#0A0D15',        // Primary luxury dark
          charcoal: '#0F1420',    // Card glassy surfaces
          slate: '#161D2E',       // Elevated interactive surfaces
          steel: '#222B40',       // Metallic borders & hairline dividers
          accent: '#F59E0B',      // Warm flagship gold
        },
        accent: {
          // Re-mapped from blue to Radiant Sunset Amber & Champagne Gold for ultra-premium luxury
          blue: '#F59E0B',        // Primary radiant gold accent
          'blue-light': '#FBBF24',
          'blue-dark': '#D97706',
          gold: '#F59E0B',        // Premium gold badges
          amber: '#F59E0B',
          emerald: '#10B981',     // Cyber emerald for in-stock & verified
          violet: '#8B5CF6',      // Ambient futuristic glow
          silver: '#94A3B8',      // Platinum / Titanium typography
        },
        surface: {
          white: '#0F1420',       // Converted to sleek dark surface
          cream: '#07090E',       // Deep obsidian canvas
          light: '#131929',       // Elevated dark card background
          muted: '#1F293D',       // Sleek metallic border
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
