import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authProvider";
import { useEffect, useState } from "react";
import LogoutModal from "../../components/LogoutModal";
import ToggleThemeButton from "../../components/toggleThemeButton";
import { GoPencil } from "react-icons/go";
import DefaultImage from "../../components/DefaultImage";
import EditProfilePic from "../../components/EditProfilePic";
import EditProfileBio from "../../components/EditProfileBio";
import FollowingsShowcase from "../../components/FollowingsShowcase";

export default function Profile() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isEditProfilePicOpen, setIsProfilePicOpen] = useState(false);
  const [isEditBioOpen, setIsEditBioOpen] = useState();
  const [isFollowingsOpen, setIsFollowingsOpen] = useState(false);

  const { user } = useAuth();

  return (
    user && (
      <div className="flex w-full flex-col">
        <div className="relative mb-14 lg:mb-32">
          <div className=" h-[180px] w-full bg-gradient-to-b from-teal-500 to-teal-700 lg:h-[300px] "></div>
          <div className=" absolute -bottom-[50px] flex w-full items-center justify-center lg:-bottom-[100px]">
            <div className="hover-display relative h-[100px] w-[100px] transition-all lg:h-[200px] lg:w-[200px]">
              {user.profile_pic_src ? (
                <img
                  src={user.profile_pic_src}
                  alt=""
                  className="h-full w-full rounded-full border-2 border-gray-200 object-cover object-center"
                />
              ) : (
                <DefaultImage size="full" />
              )}

              <div
                onClick={() => setIsProfilePicOpen(true)}
                className="hover-display-match absolute left-0 top-0 z-40 hidden h-full w-full  cursor-pointer items-center justify-center rounded-full bg-black text-4xl  text-white opacity-45 transition-all"
              >
                <GoPencil />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-14  flex flex-col items-center justify-center gap-4">
          <h1 className="text-lg font-semibold">
            {user.first_name} @{user.username}
          </h1>
          {!isEditBioOpen ? (
            <button
              onClick={() => setIsEditBioOpen(true)}
              className="flex flex-row items-center gap-2 opacity-60"
            >
              {user.bio ? user.bio : "Write your bio"} <GoPencil />
            </button>
          ) : (
            <EditProfileBio user={user} setIsEditBioOpen={setIsEditBioOpen} />
          )}
        </div>
        <div className="flex w-min flex-col gap-10 p-4  pl-10 text-lg">
          <button
            className="transition-all hover:translate-x-1 hover:scale-105"
            onClick={() => setIsFollowingsOpen(true)}
          >
            Followings
          </button>
          {isFollowingsOpen && (
            <FollowingsShowcase
              user={user}
              setIsFollowingsOpen={setIsFollowingsOpen}
            />
          )}
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="text-start transition-all hover:translate-x-1 hover:scale-105"
          >
            Logout
          </button>
          {logoutModalOpen && (
            <LogoutModal setLogoutModalOpen={setLogoutModalOpen} />
          )}
          <ToggleThemeButton />
        </div>
        {isEditProfilePicOpen && (
          <EditProfilePic setIsProfilePicOpen={setIsProfilePicOpen} />
        )}
      </div>
    )
  );
}
