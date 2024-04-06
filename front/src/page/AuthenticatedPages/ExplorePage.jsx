import { Outlet } from "react-router-dom";

export default function ExplorePage() {
  return (
    <div className="flex min-h-full w-full flex-col  gap-5">
      <div className="justfiy-center flex min-h-[84px]  items-center bg-gray-100  p-3   dark:bg-neutral-800">
        <h1 className="  text-center text-lg font-semibold">People</h1>
      </div>
      <div className="h-full p-4">
        <Outlet />
      </div>
    </div>
  );
}
