import axios from "axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { API_DOMAIN } from "../utils/API_DOMAIN";

export default function EditProfilePic({ setIsProfilePicOpen }) {
  const [img, setImg] = useState();
  const [errors, setErrors] = useState();
  const [success, setIsSucess] = useState(false);
  const [isLoading, setIsLoading] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("img", img);

      const response = await axios.put(
        `${API_DOMAIN}/users/profile_pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setIsLoading(false);
      setIsSucess(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, [1000]);
      return;
    } catch (err) {
      return setErrors(
        "You need to send a file that doesn't exceeds the size limit of 2 MB ",
      );
    }
  }
  return (
    <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-90 ">
      <form
        onSubmit={handleSubmit}
        className="relative flex w-[70%] flex-col gap-4 rounded-lg bg-white p-6  dark:bg-neutral-900 dark:text-white lg:max-w-[500px]"
      >
        <input
          type="file"
          name="img"
          accept="image/png, image/jpeg"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <div className="min-h-[30px] text-center">
          <p
            className={
              success ? "text-xs text-green-600" : "text-xs text-red-600"
            }
          >
            {success ? success : errors && errors}
          </p>
        </div>
        <button
          type="submit"
          className="rounded-md bg-black p-1 text-white dark:bg-white dark:text-black"
        >
          Edit Picture
        </button>
        <IoMdClose
          className="absolute right-2 top-2 cursor-pointer text-xl"
          onClick={() => setIsProfilePicOpen(false)}
        />
      </form>
    </div>
  );
}
