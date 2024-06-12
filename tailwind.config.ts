import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      height: {
        stage: "calc(100vh - 64px)",
      },
      width: {
        stage: "calc(100vw - 240px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
