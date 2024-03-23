import styled from 'styled-components';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import toast from 'react-hot-toast';

const ChatroomOptionsMenu = ({ setChatrooms, setActiveChatroom, friend, setOptionsMenuOpen, chatroom }) => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [, removeFriend] = useAxios(
    { url: `${import.meta.env.VITE_API_URL}/users/${auth._id}/friends/${friend._id}`, method: 'DELETE', headers: { Authorization: authHeader } },
    { manual: true }
  );

  const handleClick = async () => {
    try {
      await toast.promise(
        removeFriend(),
        {
          loading: 'Removing Friend...',
          success: `You and ${friend.username} are no longer friends`,
          error: 'Something went wrong'
        },
        { success: { duration: 5000 }, id: 'friendRemoval' }
      );
      setActiveChatroom(null);
      setChatrooms((chatrooms) => chatrooms.filter((e) => e._id !== chatroom._id));
      setOptionsMenuOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container onClick={(e) => e.stopPropagation()}>
        <div onClick={handleClick} className="remove-friend">
          <Icon icon="ph:user-minus-fill" />
          <span>Remove Friend</span>
        </div>
      </Container>
    </>
  );
};

ChatroomOptionsMenu.propTypes = {
  setChatrooms: PropTypes.func,
  setActiveChatroom: PropTypes.func,
  friend: PropTypes.object,
  setOptionsMenuOpen: PropTypes.func,
  chatroom: PropTypes.object
};

export default ChatroomOptionsMenu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--gray);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.7rem;
  width: 20rem;

  margin-top: 5rem;

  position: absolute;
  top: 0;
  right: 0;
  user-select: none;

  & > div {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0.25rem;
    padding: 1rem;

    &:hover {
      background-color: var(--gray-light);
    }
  }

  & > .remove-friend {
    position: relative;

    &:hover svg {
      color: var(--danger);
    }

    & > svg {
      font-size: 2rem;
      transition: all 0.3s;
    }
  }
`;
