import axios from "axios";
import { useAuth } from "../context/authProvider";
import { API_DOMAIN } from "../utils/API_DOMAIN";
import { useEffect, useState } from "react";

export default function FollowUnfollowButton({ visitedUser }) {
  // The initial state of isFollowed is set to null to indicate that we haven't received
  // a response yet regarding whether the current user is following the visited user or not.
  // By rendering the button conditionally based on isFollowed not being null, we ensure
  // that the button is displayed only after we've received a response from the server,
  // preventing incorrect button states while waiting for the fetching response.
  // Upon receiving the response, we update the isFollowed state accordingly (true or false).
  // The useEffect hook fetches the user's followings and updates the isFollowed state.
  // The handleFollow function handles the logic for following or unfollowing the user,
  // updating the isFollowed state accordingly based on the response from the server.
  // Errors during fetching or following/unfollowing are caught and handled appropriately.
  // The button's appearance and functionality are determined by the isFollowed state.
  const [isFollowed, setIsFollowed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [hovered, setHovered] = useState();

  useEffect(() => {
    const getUserFollowings = async () => {
      try {
        const response = await axios.get(`${API_DOMAIN}/users/followings`);
        const followings = response.data.userFollowings;
        const isFollowing = followings.some(
          (follow) => follow._id === visitedUser._id,
        );
        if (isFollowing) {
          setIsFollowed(true);
          return;
        }
        setIsFollowed(false);
        return;
      } catch (err) {
        setErrors("Could not fetch followings");
        return;
      }
    };
    getUserFollowings();
  }, [isFollowed]);

  async function handleFollow() {
    try {
      setIsLoading(true);
      if (isFollowed) {
        const response = await axios.delete(
          `${API_DOMAIN}/users/follow/${visitedUser._id}`,
        );
        if (response.status === 200) {
          setIsFollowed(false);
          return;
        }
        return;
      } else {
        const response = await axios.post(
          `${API_DOMAIN}/users/follow/${visitedUser._id}`,
        );
        if (response.status === 200) {
          setIsFollowed(true);
          return;
        }
        return;
      }
    } catch (err) {
      setErrors("We apologiese, something went wrong...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    isFollowed !== null && (
      <button
        onClick={handleFollow}
        disabled={isLoading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-[150px] rounded-xl py-2 font-semibold ${isFollowed ? "border border-black bg-white text-black hover:text-red-600 dark:border-white dark:bg-black dark:text-white dark:hover:text-red-600" : "bg-black text-white dark:bg-white dark:text-black"}`}
      >
        {isFollowed && hovered
          ? "Unfollow"
          : isFollowed
            ? "Following"
            : "Follow"}
      </button>
    )
  );
}
