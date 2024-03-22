import styled from 'styled-components';
import PropTypes from 'prop-types';

import FriendCard from './FriendCard';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const UsersList = ({ data }) => {
  const auth = useAuthUser();

  const users = data?.users.filter((e) => e._id !== auth._id) || [];

  return (
    <Container>
      {!data ? <Message>Try typing something into the search box!</Message> : null}
      {data && data.count === 0 ? <Message>There are no users that match your search</Message> : null}
      <List>
        {users.map((e) => (
          <FriendCard key={e._id} user={e} />
        ))}
      </List>
    </Container>
  );
};

UsersList.propTypes = {
  data: PropTypes.object
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Message = styled.span`
  font-size: 1.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default UsersList;
