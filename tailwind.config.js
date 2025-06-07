module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--background)",
        text: "var(--color-foreground)",
        primary: "var(--color-primary)",
        overlay: "var(--overlay)",
      },
    },
  },
};
