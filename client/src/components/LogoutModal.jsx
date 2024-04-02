import { IoMdClose } from "react-icons/io";
import { useAuth } from "../context/authProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeProvider";

export default function LogoutModal({ setLogoutModalOpen }) {
  const { setToken } = useAuth();

  const navigation = useNavigate();

  function handleLogout() {
    // remove token and go back go root
    setToken();
    localStorage.removeItem("theme");
    navigation("/", { replace: true });
    // Theme will not be in localStorage but,
    // at the moment of navigation to '/', it still was,
    // so the style of dark persists, for this reason refresh,
    // to populate the page with the light theme.
    // Dark theme is only for user interface.
    window.location.reload();
  }

  return (
    <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-90  ">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6  dark:bg-neutral-900 dark:text-white">
        <h1>Are you sure you want to logout?</h1>
        <div className="flex flex-row justify-evenly">
          <button onClick={handleLogout}>Yes</button>
          <button onClick={() => setLogoutModalOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
