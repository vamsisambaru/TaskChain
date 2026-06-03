/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0F',
          elevated: '#12121A',
          surface: '#1A1A24',
          glass: 'rgba(26,26,36,0.7)',
        },
        accent: {
          purple: '#7C5CFF',
          violet: '#9C7BFF',
          pink: '#FF6BCB',
          cyan: '#5CCFFF',
          green: '#3DDC97',
          amber: '#FFB454',
          red: '#FF5C7A',
        },
        text: {
          primary: '#F5F5FA',
          secondary: '#A1A1B5',
          muted: '#5C5C73',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        display: ['Inter-Bold'],
        body: ['Inter-Regular'],
      },
    },
  },
  plugins: [],
};
