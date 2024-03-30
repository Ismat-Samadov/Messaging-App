import styled from 'styled-components';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import PropTypes from 'prop-types';
import getChatroomLetter from '../utils/getChatroomLetter';
import getChatroomTitle from '../utils/getChatroomTitle';

import CircleLetter from './CircleLetter';

const ChatPreview = ({ chatroom, setActiveChatroom, chatrooms }) => {
  const auth = useAuthUser();
  const chatLetter = getChatroomLetter(chatroom, auth);
  const chatTitle = getChatroomTitle(chatroom, auth);
  const lastMessage = chatroom.messages[0] ? (
    <span>
      {chatroom.messages[0].author.username}:{' '}
      {chatroom.messages[0].content.length > 25 ? chatroom.messages[0].content.slice(0, 25).trim() + '...' : chatroom.messages[0].content}
    </span>
  ) : null;

  const handleClick = () => {
    const index = chatrooms.findIndex((e) => e._id.toString() === chatroom._id.toString());
    setActiveChatroom(index);
  };

  return (
    <Container onClick={handleClick}>
      <div className="chat-portrait">
        <CircleLetter>{chatLetter}</CircleLetter>
      </div>
      <Content>
        <div className="title">{chatTitle}</div>
        <div className="last-message">{lastMessage || 'No messages here yet...'}</div>
      </Content>
    </Container>
  );
};

ChatPreview.propTypes = {
  chatroom: PropTypes.object,
  setActiveChatroom: PropTypes.func,
  chatrooms: PropTypes.array
};

export default ChatPreview;

const Container = styled.div`
  display: flex;
  padding: 1rem;
  gap: 2rem;
  cursor: pointer;
  border-radius: 0.5rem;

  &:hover {
    background-color: var(--gray);
  }

  & > .chat-portrait {
    display: flex;
    align-items: center;
  }
`;

const Content = styled.div`
  display: grid;
  align-self: center;

  & > .title {
    font-weight: 700;
    font-size: 1.7rem;
  }

  & > .last-message {
    font-size: 1.7rem;
  }
`;
