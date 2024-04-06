import catImg from "../assets/kitty-cat.jpeg";
import anonymousPic from "../assets/anonymous_pic.png";

export default function DefaultImage({ size }) {
  return (
    <img
      src={anonymousPic}
      className={`h-${size} w-${size} rounded-full border-2 border-gray-200 object-cover object-center`}
    />
  );
}
