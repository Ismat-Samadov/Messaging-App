import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_DOMAIN } from "../../utils/API_DOMAIN";
import DefaultImage from "../../components/DefaultImage";
import { useAuth } from "../../context/authProvider";
import FollowUnfollowButton from "../../components/FollowUnfollowBtn";
import formatDate from "../../utils/formatDate";
import SendOrStartConversationButton from "../../components/SendOrStartConvoButton";
import LoadingDots from "../../components/LoadingDots";
import AccessDenied from "../ErrorPages/AccessDenied";

export default function VisitedProfile() {
  const [visitedUser, setVisitedUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const navigation = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Don't allow the user tries to see is profile from a VisitedProfile prespective
        // redirect him to his profile
        if (id === user._id) {
          navigation("/profile", { replace: true });
          return;
        }
        setIsLoading(true);
        // Get visited user data:
        const response = await axios.get(`${API_DOMAIN}/users/${id}`);
        setVisitedUser(response.data);
        return;
      } catch (err) {
        return setErrors("We apologize, could not fetch this user...");
      } finally {
        setIsLoading(false);
      }
    };

    // Conditionally calling the getUser function ensures that it's executed only when a valid user exists.
    // Without this check, the useEffect hook would run on component mount, potentially triggering an error
    // if the user is not yet populated (i.e., null or undefined). By verifying the existence of the user,
    // we prevent setting an error unnecessarily during initial mounting. Additionally, this prevents the
    // persistence of any error state from the initial mount, even if the user becomes defined later and the
    // useEffect reruns due to changes in dependencies. This approach ensures a smoother handling of errors
    // and avoids unnecessary re-renders caused by state inconsistencies.
    if (user) {
      getUser();
    }
  }, [user]);
  // We need to set user as a dependecies because when we refresh a page (without [user]),
  // {user} might not be populated yet. Causing the if statement inside the useEffect, to setIsFollowed
  //  to false, because the user does not exist. Therefore, the if statement doesn't run.

  if (errors) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <div className="w-full items-center justify-center pt-40">
        <LoadingDots />
      </div>
    );
  }

  return (
    visitedUser && (
      <div className="flex w-full flex-col">
        <div className="relative mb-14 lg:mb-32">
          <div className=" h-[180px] w-full bg-gradient-to-b from-teal-500 to-teal-700 lg:h-[300px] "></div>
          <div className=" absolute -bottom-[50px] flex w-full items-center justify-center lg:-bottom-[100px]">
            <div className="hover-display relative h-[100px] w-[100px] lg:h-[200px] lg:w-[200px]">
              {visitedUser.user.profile_pic_src ? (
                <img
                  src={visitedUser.user.profile_pic_src}
                  alt=""
                  className="h-full w-full rounded-full border-2 border-gray-200 object-cover object-center"
                />
              ) : (
                <DefaultImage size="full" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-lg font-semibold">
            {visitedUser.user.first_name} @{visitedUser.user.username}
          </h1>
          <div className="flex flex-col items-center ">
            <p className="font-semibold">About me:</p>
            <p className="opacity-70">
              {visitedUser.user.bio
                ? visitedUser.user.bio
                : "This user has no bio..."}
            </p>
          </div>

          <div className="flex flex-col items-center ">
            <p className="font-semibold">Member since:</p>
            <p className="text-s opacity-70">
              {formatDate(visitedUser.user.utc_creation)}
            </p>
          </div>
          <FollowUnfollowButton visitedUser={visitedUser.user} />
          <SendOrStartConversationButton visitedUser={visitedUser} />
        </div>
      </div>
    )
  );
}
