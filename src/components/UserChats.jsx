import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ChatPreview from './ChatPreview';

const UserChats = ({ setActiveChatroom, loading, chatrooms }) => {
  return (
    <Container>
      {!loading && chatrooms.length === 0 ? <h3>Nothing to see here...</h3> : null}
      {loading ? (
        <ClipLoader cssOverride={{ display: 'block', margin: '0 auto' }} color="var(--light)" size={75} />
      ) : (
        chatrooms.map((e) => <ChatPreview chatrooms={chatrooms} setActiveChatroom={setActiveChatroom} key={e._id} chatroom={e} />)
      )}
    </Container>
  );
};

UserChats.propTypes = {
  setActiveChatroom: PropTypes.func,
  chatrooms: PropTypes.array,
  loading: PropTypes.bool
};

export default UserChats;

const Container = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem 0;

  height: calc((100vh - 5rem) - 25rem);
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

  & > h3 {
    text-align: center;
    margin-top: 2rem;
    font-size: 2rem;
  }
`;
