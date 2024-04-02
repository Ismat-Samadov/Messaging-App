import { Link } from "react-router-dom";
import glassesKissSvg from "../../assets/reshot-icon-glasses-kiss-YUSND43AHW.svg";
import demonSvg from "../../assets/reshot-icon-demon-RHZBQ8E7SN.svg";
import loveSvg from "../../assets/reshot-icon-love-U63YHWCBJX.svg";
import moneySvg from "../../assets/reshot-icon-money-S6DHLMN347.svg";
import tongeSvg from "../../assets/reshot-icon-tongue-Y92VG4RXPL.svg";
import messagingPhoto from "../../assets/messaging-photo.jpg";

export default function UnauthenticatedHomepage() {
  return (
    <div className=" grid h-screen grid-rows-2 bg-gradient-to-b from-rose-500 to-rose-900 p-6 font-roboto text-white lg:grid-cols-2 lg:gap-6 ">
      <div className="relative lg:col-start-1 ">
        <img
          src={glassesKissSvg}
          alt="glasses kiss emoji "
          className=" absolute h-40 rotate-12 lg:h-60 2xl:h-80"
        />
        <img
          src={demonSvg}
          alt="demon emoji"
          className=" absolute bottom-0 right-0 h-24 rotate-[30deg] lg:-bottom-10 lg:right-10 lg:h-24 2xl:-bottom-[120px] 2xl:right-[50px] 2xl:h-32"
        />
        <img
          src={loveSvg}
          alt="love moji"
          className="absolute bottom-12 left-6 h-16 -rotate-12 lg:bottom-0 lg:h-24 2xl:-bottom-[50px] 2xl:h-32 "
        />
        <img
          src={moneySvg}
          alt="money face emoji"
          className="absolute right-0 h-16  rotate-12 lg:h-40 2xl:h-44 "
        />
        <img
          src={tongeSvg}
          alt="tonge out emoji"
          className="absolute bottom-32 right-[78px] h-16 lg:right-[100px] lg:top-[180px] lg:h-32 xl:right-[200px]  2xl:h-52 "
        />
      </div>
      <img
        src={messagingPhoto}
        alt="person messaging photo"
        className=" hidden h-full w-full justify-self-center rounded-2xl object-cover object-center shadow-2xl lg:col-start-2 lg:row-start-1 lg:row-end-3 lg:block "
      />
      <div className="flex flex-col justify-evenly lg:col-start-1 lg:row-start-2 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl lg:text-6xl lg:font-bold 2xl:text-7xl ">
            Let's Get Started
          </h1>
          <p>
            Connect with each other with chatting. Enjoy safe and private
            texting
          </p>
        </div>
        <Link
          to="/sign-up"
          className="button-default primary-text-color bg-white xl:py-4 xl:text-xl "
        >
          Start Chatting
        </Link>
        <p className="xl: self-center">
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
