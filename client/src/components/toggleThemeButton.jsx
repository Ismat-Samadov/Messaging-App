import { useTheme } from "../context/themeProvider";
import { LuSun } from "react-icons/lu";
import { IoMdMoon } from "react-icons/io";

export default function ToggleThemeButton() {
  const { themeMode, setTheme } = useTheme();

  return (
    <div
      className="h-10 w-min text-black transition-all hover:scale-110"
      onClick={setTheme}
    >
      {themeMode === "dark" ? (
        <LuSun className="cursor-pointer text-2xl text-white " />
      ) : (
        <IoMdMoon className="cursor-pointer text-2xl " />
      )}
    </div>
  );
}
