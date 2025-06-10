module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-background)",
        text: "var(--color-foreground)",
        overlay: "var(--color-overlay)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        highlight: "var(--color-highlight)",
        danger: "var(--color-danger)",
        muted: "var(--color-muted)",
        suggest: "var(--color-suggest)",
        item: "var(--color-item)",
        ability: "var(--color-ability)",


        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        inventoryBg: 'var(--color-inventory-bg)',

        userMessage: 'var(--color-user-message)',
        systemMessage: 'var(--color-system-message)',

        button: 'var(--color-button)',
        buttonHover: 'var(--color-button-hover)',

        useItem: 'var(--color-use-item)',
        defaultAction: 'var(--color-default-action)',
        hoverBg: 'var(--color-hover-bg)',

        inventory: 'var(--color-inventory)',
      },
    },
  },
};
