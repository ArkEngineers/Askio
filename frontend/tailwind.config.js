const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
    },
  },
  plugins: [],
})