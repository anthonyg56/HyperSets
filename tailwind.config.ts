import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '20px',
        sm: ''
      }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "hyper-white": "#FFFFFF",
        "hyper-dark-white": "#EDF2F4",
        "hyper-grey": "#8D99AE",
        "hyper-dark-grey": "#2B2D42",
        "hyper-red": "#D90429",
        "hyper-dark-red": "#EF233C",
        "hyper-green": "#008000"
      }
    },
  },
  plugins: [],
}
export default config
