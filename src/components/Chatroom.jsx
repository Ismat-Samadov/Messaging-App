import PropTypes from 'prop-types';
import styled from 'styled-components';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { Icon } from '@iconify/react';
import getChatroomLetter from '../utils/getChatroomLetter';
import getChatroomTitle from '../utils/getChatroomTitle';
import { useState } from 'react';

import CircleLetter from './CircleLetter';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';
import ChatroomOptionsMenu from './ChatroomOptionsMenu';

const Chatroom = ({ chat, setChatrooms, setActiveChatroom }) => {
  if (!chat) return <EmptyMessage />;

  const auth = useAuthUser();
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);

  const chatLetter = getChatroomLetter(chat, auth);
  const chatTitle = getChatroomTitle(chat, auth);

  const friend = chat.participants.find((e) => e._id !== auth._id);

  const closeOptionsMenu = () => (optionsMenuOpen ? setOptionsMenuOpen(false) : null);

  return (
    <>
      <ChatroomContainer onClick={closeOptionsMenu}>
        <div className="chat-header">
          <CircleLetter>{chatLetter}</CircleLetter>
          <div className="chat-title">
            <span>{chatTitle}</span>
          </div>
          <div className="chat-actions" onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}>
            <Icon icon="ph:dots-three-outline-vertical-fill" />
            {optionsMenuOpen && chat.participants.length === 2 && (
              <ChatroomOptionsMenu
                friend={friend}
                setChatrooms={setChatrooms}
                setActiveChatroom={setActiveChatroom}
                setOptionsMenuOpen={setOptionsMenuOpen}
                chatroom={chat}
              />
            )}
          </div>
        </div>
        <div className="chat-body">
          {chat.messages.map((e) => (
            <ChatBubble chatroom={chat} direction={e.author._id.toString() === auth._id.toString() ? 'right' : 'left'} key={e._id} message={e} />
          ))}
        </div>
        <ChatForm setChatrooms={setChatrooms} chatId={chat._id.toString()} />
      </ChatroomContainer>
    </>
  );
};

Chatroom.propTypes = {
  chat: PropTypes.object,
  setChatrooms: PropTypes.func,
  setActiveChatroom: PropTypes.func
};

export default Chatroom;

const ChatroomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  & > .chat-header {
    display: flex;
    padding: 1rem 2rem;
    background-color: var(--dark);
    border-left: 1px solid black;

    align-items: center;
    justify-content: space-between;

    height: 8rem;

    @media (max-width: 800px) {
      border-left: none;
      border-top: 2px solid black;
    }

    & > .chat-title {
      flex-grow: 1;

      font-size: 2rem;
      font-weight: 700;
      padding-inline-start: 1rem;
    }

    & > .chat-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;

      position: relative;

      &:hover {
        background-color: var(--gray);
      }
    }
  }

  .chat-body {
    display: flex;
    flex-direction: column-reverse;
    justify-content: end;

    /* Height of main container is 100vh minus the container padding(5rem) */
    /* Then we subtract the height of the header and input box (8rem and 10rem ) */
    /* finally the padding of the chatroom container (1rem) */
    height: calc((100vh - 5rem) - 18rem - 1rem);

    gap: 2rem;
    padding: 1rem;
    font-size: 1.7rem;

    overflow-y: auto;

    &::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 12px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: #555;
    }
  }
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  & > h2 {
    font-size: 5rem;
  }

  & > p {
    font-size: 1.7rem;
  }
`;

const EmptyMessage = () => (
  <CenterContainer>
    <h2>Welcome to ChatApp!</h2>
    <p>Click on any chat to display its messages</p>
  </CenterContainer>
);
