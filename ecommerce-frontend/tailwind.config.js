const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", flowbite.content()],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      primary: {
        100: "#fff7e1",
        200: "#fdedce",
        300: "#f7d9a1",
        400: "#f2c471",
        500: "#edb247",
        600: "#eba62c",
        700: "#eaa11c",
        800: "#d08d0d",
        900: "#a16a00",
      },
      secondary: {
        100: "#ffe9e9",
        200: "#ffd3d2",
        300: "#f8a5a4",
        400: "#f17472",
        500: "#ec4a49",
        600: "#e9312e",
        700: "#e9221f",
        800: "#cf1413",
        900: "#a20009",
      },
    },
    fontFamily: {
      sans: ["Montserrat", "Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      nunito: ["Nunito", "sans-serif"],
      montserrat: ["Montserrat", "sans"],
      questrail: ["Questrial", "sans-serif"],
      lato: ["Lato", "sans-serif"],
      circe: ["Circe"],
      cardoBold: ["Cardo-Bold"],
      cardoItalic: ["Cardo-Italic"],
      cardoRegular: ["Cardo-Regular"],

      heading: ["Poppins", "ui-sans-serif", "sans-serif"],
      body: ["Inter", "ui-sans-serif", "sans-serif"],
      gilroyRegular: ["Gilroy-Regular"],
      melodramaRegular: ["Melodrama-Regular"],
    },
    extend: {
      colors: {
        // vintage: "#f5ecd6",
        vintageBg: "#f5f2f2ff",
        // vintageBg: "#f4dfb4",
        vintageText: "#326638",
        vintageBorder: "#eae9e9ff",
        // vintageBorder: "#f4d599ff",
        yellowBg: "bg-yellow-600",
        yellowText: "text-yellow-600",
        yellowBorder: "yellow-600",
        light: "#ffffff",
        dark: "#1d0900",
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        marquee2: "marquee2 20s linear infinite",
        shimmer: "shimmer 1.5s infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
