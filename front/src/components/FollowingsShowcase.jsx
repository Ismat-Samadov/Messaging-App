import { Link } from "react-router-dom";
import anonymousPic from "../assets/anonymous_pic.png";
import { IoMdClose } from "react-icons/io";

export default function FollowingsShowcase({ user, setIsFollowingsOpen }) {
  return (
    user && (
      <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-90  ">
        <div className="flex h-[500px]  w-[90%] flex-col gap-4 rounded-lg bg-white p-4 dark:bg-neutral-900  dark:text-white lg:w-[40%]">
          <div className="flex flex-row justify-between">
            <h1>Followings</h1>
            <button onClick={() => setIsFollowingsOpen(false)}>
              <IoMdClose />
            </button>
          </div>
          <div className="flex h-[90%]  w-full flex-col gap-4 overflow-auto p-4 lg:grid lg:self-center">
            {user.following.map((following) => (
              <Link
                to={`/users/${following._id}`}
                key={following._id}
                className="flex max-h-[150px] flex-row items-center gap-3 bg-gray-100 p-4 dark:bg-neutral-800 "
              >
                {following.profile_pic_src ? (
                  <img
                    src={following.profile_pic_src}
                    alt=""
                    className=" h-[70px] w-[70px] rounded-full   object-cover object-center"
                  />
                ) : (
                  <img
                    src={anonymousPic}
                    className=" h-[70px] w-[70px] rounded-full   object-cover object-center"
                  ></img>
                )}
                <div className="flex h-full flex-col justify-center">
                  <p className="font-semibold">{following.first_name}</p>
                  <p className=" ">@{following.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
