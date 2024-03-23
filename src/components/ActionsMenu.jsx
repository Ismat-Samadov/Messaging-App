import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';

import FriendsMenu from './FriendsMenu';
import FriendRequestMenu from './FriendRequestMenu';

const ActionsMenu = ({ friendRequests, setFriendRequests, setChatrooms }) => {
  const [friendsMenuOpen, setFriendsMenuOpen] = useState(false);
  const [frMenuOpen, setFRMenuOpen] = useState(false);

  return (
    <>
      <FriendsMenu isOpen={friendsMenuOpen} closeModal={() => setFriendsMenuOpen(false)} />
      <FriendRequestMenu
        isOpen={frMenuOpen}
        closeModal={() => setFRMenuOpen(false)}
        setChatrooms={setChatrooms}
        friendRequests={friendRequests}
        setFriendRequests={setFriendRequests}
      />
      <Container onClick={(e) => e.stopPropagation()}>
        <div onClick={() => setFRMenuOpen(true)} className="friend-requests">
          <Icon icon="ph:users-fill" />
          <span>Friend Requests</span>
          {friendRequests.length > 0 ? <span className="fr-notification" /> : null}
        </div>
        <div onClick={() => setFriendsMenuOpen(true)}>
          <Icon icon="ph:user-circle-plus-fill" />
          <span>Add Friend</span>
        </div>
      </Container>
    </>
  );
};

ActionsMenu.propTypes = {
  friendRequests: PropTypes.array,
  setFriendRequests: PropTypes.func,
  setChatrooms: PropTypes.func
};

export default ActionsMenu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--gray);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.7rem;
  width: 18rem;

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

  & > .friend-requests {
    position: relative;

    & > span.fr-notification {
      position: absolute;
      top: 1rem;
      right: 1rem;

      display: grid;
      place-items: center;
      width: 1.5rem;
      aspect-ratio: 1/1;
      border-radius: 50%;
      background-color: var(--danger);
    }
  }
`;
