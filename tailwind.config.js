module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsx': '940px',
      },
      colors: {
        'custom-back-grey': '#6d5700e7',
        'custom-blue': '#001433',
      },
      fontSize: {
        'custom-sz': '25px',

        'custom-size': '20px',
      },
      boxShadow: {
        'custom-light': '1px 1px 10px rgb(0, 30, 65)',
        'custom-dark': '0px 0px 5px rgb(0, 30, 65, 0.488 )',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeInOut: 'fadeInOut 2s infinite',
      }
    },
  },
  plugins: [],
}
