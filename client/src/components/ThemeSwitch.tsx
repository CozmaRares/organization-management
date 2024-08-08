import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.body.classList.contains("dark") ? "dark" : "light",
  );

  const setDark = () => {
    setTheme("dark");
    window.localStorage.setItem("theme", "dark");
    document.body.classList.add("dark");
  };

  const setLight = () => {
    setTheme("light");
    window.localStorage.setItem("theme", "light");
    document.body.classList.remove("dark");
  };

  const toggleTheme = (): void => {
    if (theme === "light") {
      setDark();
    } else {
      setLight();
    }

    document.body.classList.add("no-duration");

    setTimeout(() => document.body.classList.remove("no-duration"), 1);
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme") as Theme | null;

    if (localTheme)
      if (localTheme === "dark") {
        setDark();
      } else {
        setLight();
      }
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="btn rounded-lg p-2"
    >
      {theme == "light" ? <Sun /> : <Moon />}
    </button>
  );
}
