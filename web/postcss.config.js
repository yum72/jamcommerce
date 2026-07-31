// Tailwind 4 moved its PostCSS plugin into its own package, and handles unused
// class removal itself. The old @fullhuman/postcss-purgecss step is gone.
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
