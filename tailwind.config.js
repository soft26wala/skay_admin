/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#0A0D14",
          surface: "#101520",
          card: "#141A28",
          cardHover: "#1A2234",
          border: "rgba(212, 175, 55, 0.15)",
          borderLight: "rgba(255, 255, 255, 0.08)",
          gold: "#D4AF37",
          goldLight: "#F5E7B2",
          goldDark: "#9B7D1A",
          bronze: "#C59B27",
          emerald: "#10B981",
          muted: "#94A3B8",
          subtext: "#64748B",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        serif: ["'Cinzel'", "'Playfair Display'", "serif"],
      },
      backgroundImage: {
        "dark-gradient": "linear-gradient(135deg, #182030 0%, #0F1420 100%)",
        "red-gradient": "linear-gradient(135deg, #EF4444 0%, #991B1B 100%)",
        "blue-gradient": "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        "gold-gradient": "linear-gradient(135deg, #F5E7B2 0%, #D4AF37 50%, #9B7D1A 100%)",
        "gold-subtle": "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.04) 100%)",
        "emerald-subtle": "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.04) 100%)",
        "luxury-glass": "linear-gradient(180deg, rgba(20, 26, 40, 0.75) 0%, rgba(12, 16, 26, 0.85) 100%)",
        "luxury-card": "linear-gradient(180deg, #131825 0%, #0D121D 100%)",
      },
      boxShadow: {
        "luxury-glow": "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "emerald-glow": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "card-luxury": "0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        "dropdown-luxury": "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};

