/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        navy: '#0D1B2E',
        bluemid: '#1A4A8A',
        brandyellow: '#FFD600',
        brandyellowHover: '#E6C200',
        darker: '#08111D',
        turquoise: '#00E5C7',
        coral: '#FF6F5E',
        twilight: '#7C6CFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
