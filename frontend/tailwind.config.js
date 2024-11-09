const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
<<<<<<< HEAD
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
=======
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
>>>>>>> 4e87f9035169589c8c835fd4f1fe9ea8dab3a8f2
  ],
  theme: {
    extend: {
      colors: {
        "base": {
          1: "#E2F1E7",
          2: "#AD49E1",
          3: "#7A1CAC",
          4: "#243642",
        },
        "grey": {
          1: "#ACACAC",
          2: "#C0C0C0",
          3: "#D7D7D7",
          4: "#EBEBEB",
          5: "#FFFFFF",
          6: "#343434",
          7: "#252525",
          8: "#1D1D1D",
          9: "#151515",
          10: "#000000",
        },
      },
      backgroundColor: {
        "base": {
          1: "#E2F1E7",
          2: "#AD49E1",
          3: "#7A1CAC",
          4: "#243642",
        },
        "grey": {
          1: "#ACACAC",
          2: "#C0C0C0",
          3: "#D7D7D7",
          4: "#EBEBEB",
          5: "#FFFFFF",
          6: "#343434",
          7: "#252525",
          8: "#1D1D1D",
          9: "#151515",
          10: "#000000",
        },
      },
<<<<<<< HEAD
=======
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
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
      },
>>>>>>> 4e87f9035169589c8c835fd4f1fe9ea8dab3a8f2
    },
  },
  plugins: [],
})