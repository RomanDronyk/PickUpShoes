/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './routes/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      content: {
        colorFilterActive: 'url("../assets/images/color-arrow.svg")',
      },

      fontFamily: {
        sans: ["'Gilroy'"],
      },
      colors: {
        red: 'hsl(var(--red))',
        bageRed: 'hsl(var(--bage-red))',
        lightGray: 'hsl(var(--bg-input))',
        darkRed: 'hsl(var(--dark-red))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        placeholderText: 'hsl(var(--placeholder-text))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        placeholder: 'hsl(var(--black))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        heroBg: "url('../assets/images/hero-left.png')",
        menCollection: 'url("../assets/images/men-collection.png")',
        womenCollection: 'url("../assets/images/women-collection.png")',
        wearCollection: 'url("../assets/images/wear-collection.png")',
        notFoundBg: 'url("../assets/images/404.jpg")',
        swtichMenWite: 'url("../assets/images/switch-user-white.svg")',
        swtichMenBlack: 'url("../assets/images/switch-user-black.svg")',
        switchWoomenBlack: 'url("../assets/images/switch-woomen-black.svg")',
        switchWoomenWhite: 'url("../assets/images/switch-woomen-white.svg")',
      },
      dropShadow: {
        '3xl': '0 4px 15px rgba(0,0,0,0.25)',
        cart: '0 4px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    require('tailwind-scrollbar'),
  ],
};
