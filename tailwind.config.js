export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.45)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.65 },
          "50%": { opacity: 1 },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shake: {
          "0%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-3px)" },
          "40%": { transform: "translateX(3px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        floaty: "floaty 3s ease-in-out infinite",
        shake: "shake 450ms ease-in-out 1",
      },
    },
  },
  plugins: [],
};
