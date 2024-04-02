import { FiSearch } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react";
import LogoutModal from "./LogoutModal";
import { IoIosPeople } from "react-icons/io";
import { GrGroup } from "react-icons/gr";

export default function Nav() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const commonStyles =
    "flex justify-center  self-center rounded-lg  p-3 text-center text-2xl hover:scale-110 transition-all";
  const normalLink = `hover:bg-gray-200 hover:dark:bg-neutral-700 ${commonStyles}`;
  const activeLink = `bg-gray-300 dark:bg-neutral-600 ${commonStyles}`;

  return (
    <>
      <nav className="  flex w-full flex-row items-center justify-center gap-6 rounded-lg text-center lg:relative lg:h-full lg:flex-col">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <FiMessageSquare />
        </NavLink>
        <NavLink
          to="/explore/page=1"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <GrGroup />
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          <GoPerson />
        </NavLink>
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="absolute bottom-10 left-[30px] hidden text-2xl transition-all hover:scale-110 lg:block"
        >
          <TbLogout2 />
        </button>
      </nav>
      {logoutModalOpen && (
        <LogoutModal setLogoutModalOpen={setLogoutModalOpen} />
      )}
    </>
  );
}
