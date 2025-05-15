// tailwind.config.js

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        caramellatte: {
          "base-100": "oklch(98% 0.016 73.684)",
          "base-200": "oklch(95% 0.038 75.164)",
          "base-300": "oklch(90% 0.076 70.697)",
          "base-content": "oklch(40% 0.123 38.172)",
          primary: "oklch(0% 0 0)",
          "primary-content": "oklch(100% 0 0)",
          secondary: "oklch(22.45% 0.075 37.85)",
          "secondary-content": "oklch(90% 0.076 70.697)",
          accent: "oklch(46.44% 0.111 37.85)",
          "accent-content": "oklch(90% 0.076 70.697)",
          neutral: "oklch(55% 0.195 38.402)",
          "neutral-content": "oklch(98% 0.016 73.684)",
          info: "oklch(42% 0.199 265.638)",
          "info-content": "oklch(90% 0.076 70.697)",
          success: "oklch(43% 0.095 166.913)",
          "success-content": "oklch(90% 0.076 70.697)",
          warning: "oklch(82% 0.189 84.429)",
          "warning-content": "oklch(41% 0.112 45.904)",
          error: "oklch(70% 0.191 22.216)",
          "error-content": "oklch(39% 0.141 25.723)",
        },
      },
    ],
    themesConfig: {
      defaultTheme: "caramellatte",
    },
  },
};