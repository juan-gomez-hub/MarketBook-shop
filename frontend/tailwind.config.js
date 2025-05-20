/** @type {import(tailwindcss).Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
 function ({ addComponents }) {
      addComponents({
        '.inputs': {

          borderRadius: '0.375rem',
          borderWidth: '1px',
          borderColor: '#D1D5DB',
          padding: '0.5rem 1rem',
          outline: 'none',
          '&:focus': {
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
          }
        }
      });
    }
  ],
}
