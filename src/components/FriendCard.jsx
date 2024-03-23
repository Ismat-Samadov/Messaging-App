import styled from 'styled-components';
import PropTypes from 'prop-types';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { Icon } from '@iconify/react';
import useAxios from 'axios-hooks';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';

import CircleLetter from './CircleLetter';

const FriendCard = ({ user }) => {
  const auth = useAuthUser();
  const alreadyFriends = user.friends.some((e) => e.user === auth._id);
  const [frSent, setFRSent] = useState(false);
  const authHeader = useAuthHeader();

  const [{ loading, data }, sendFriendRequest] = useAxios(
    { url: `${import.meta.env.VITE_API_URL}/friendRequests`, method: 'POST', headers: { Authorization: authHeader } },
    { manual: true }
  );

  const handleClick = async () => {
    try {
      if (alreadyFriends || frSent) return;
      await toast.promise(
        sendFriendRequest({ data: { recipient: user._id } }),
        {
          loading: 'Sending Friend Request...',
          success: 'Friend Request Sent!',
          error: (err) => (err.response && err.response.status === 422 ? 'There is a pending friend request' : 'Something went wrong')
        },
        { success: { duration: 5000 }, id: 'frSent' }
      );
      setFRSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <CircleLetter>{user.username.at(0).toUpperCase()}</CircleLetter>
      <span className="username">{user.username}</span>
      {!loading ? (
        <Icon
          onClick={handleClick}
          className={`add-friend-icon icon ${alreadyFriends && 'friends'} ${frSent && 'fr-sent'}`}
          icon={data ? 'ph:check-bold' : 'ph:user-plus-fill'}
        />
      ) : null}
      <BeatLoader loading={loading} color="var(--light)" size={5} />
    </Container>
  );
};

FriendCard.propTypes = {
  user: PropTypes.object
};

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 2rem;
  border-radius: 0.5rem;

  background-color: var(--dark);
  color: var(--light);
  font-size: 1.4rem;
  padding: 1rem;

  & > span.username {
    flex-grow: 1;
  }

  & > .add-friend-icon {
    font-size: 3rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: var(--info);
    }
  }

  & > .friends {
    color: var(--gray);
    cursor: auto;

    &:hover {
      color: var(--gray);
    }
  }

  & > .fr-sent {
    color: var(--success);
    cursor: auto;

    &:hover {
      color: var(--success);
    }
  }
`;

export default FriendCard;
