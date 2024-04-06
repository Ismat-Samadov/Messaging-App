import { Link } from "react-router-dom";
import notFoundImg from "../../assets/404.svg";

export default function AccessDenied() {
  return (
    <div className="h-screen font-roboto xl:grid xl:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-gradient-to-b from-rose-500 to-rose-900 xl:flex">
        <img src={notFoundImg} alt="" />
      </div>
      <div className="flex h-full flex-col items-center justify-center p-6 xl:px-20 ">
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="text-3xl font-semibold text-rose-500">Oops !</p>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-8xl font-semibold ">404</h1>
              <h2 className="text-6xl font-semibold text-gray-500 lg:text-8xl">
                Not Found
              </h2>
            </div>
            <Link to="/" className="font-semibold text-rose-500 underline">
              Click here to go back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
