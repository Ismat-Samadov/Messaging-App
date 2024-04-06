import { Outlet } from "react-router-dom";
import Nav from "../../components/Nav";

export default function AuthenticatedLayout() {
  return (
    <div className="relative flex h-screen w-screen  items-center justify-center ">
      <div className="absolute z-10 flex h-screen w-screen flex-col bg-gray-200">
        <div className=" h-[20%] bg-rose-500"></div>
        <div className="flex h-full w-full flex-row">
          <div className="h-[25%] w-[8%] self-end bg-rose-500"></div>
        </div>
      </div>
      <div className=" z-20 grid h-full w-full grid-rows-10 bg-gray-200 font-sans dark:bg-neutral-800 dark:text-white lg:flex  lg:h-[90%] lg:w-[90%]  lg:flex-row">
        <div className="row-start-10 row-end-11 flex w-full  items-center justify-center  bg-gray-100  p-2 dark:bg-neutral-800  lg:h-full lg:w-[100px]  ">
          <Nav></Nav>
        </div>
        <div className="row-start-1 row-end-10 overflow-auto  bg-white  dark:bg-neutral-900 lg:flex lg:min-h-0 lg:flex-1  lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
