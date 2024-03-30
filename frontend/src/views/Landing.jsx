import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useAxios from 'axios-hooks';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

import UserChats from '../components/UserChats';
import Chatroom from '../components/Chatroom';
import ActionsMenu from '../components/ActionsMenu';
import NewChatMenu from '../components/newChatMenu';

const Landing = () => {
  const auth = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const authHeader = useAuthHeader();

  const [{ data, loading }] = useAxios({
    url: `${import.meta.env.VITE_API_URL}/users/${auth._id}/chatrooms`,
    method: 'GET',
    headers: { Authorization: authHeader }
  });

  useEffect(() => {
    if (data?.chatrooms) setChatrooms(data.chatrooms);
  }, [data]);

  const [{ data: frData }] = useAxios({
    url: `${import.meta.env.VITE_API_URL}/friendRequests/${auth._id}`,
    method: 'GET',
    headers: { Authorization: authHeader }
  });

  useEffect(() => {
    if (frData?.pendingFR) setFriendRequests(frData.pendingFR);
  }, [frData]);

  const [activeChatroom, setActiveChatroom] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [showingActions, setShowingActions] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [newChatMenuOpen, setNewChatMenuOpen] = useState(false);

  useEffect(() => {
    if (activeChatroom !== null) setActiveChatroom(0);
  }, [chatrooms]);

  const executeLogout = () => {
    signOut();
    return navigate('/login');
  };

  const closeActionsMenu = () => {
    if (showingActions) setShowingActions(false);
  };

  return (
    <StyledMain>
      <NewChatMenu isOpen={newChatMenuOpen} closeModal={() => setNewChatMenuOpen(false)} setChatrooms={setChatrooms} />
      <Content>
        <Sidebar onClick={closeActionsMenu}>
          <div className="welcome-msg">
            <h2>Welcome, {auth.username}</h2>
            <Icon onClick={executeLogout} className="logout-icon" icon="ph:sign-out-bold" />
          </div>
          <div className="chats">
            <div className="chats-heading">
              <h1>Chats</h1>
              <div>
                <Icon onClick={() => setNewChatMenuOpen(true)} className="new-chat-icon icon" icon="ph:note-pencil-fill" />
                <div className="actions-menu">
                  <Icon onClick={() => setShowingActions(!showingActions)} className="more-icon icon" icon="ph:dots-three-outline-vertical-fill" />
                  {friendRequests.length > 0 ? <span>{friendRequests.length || null}</span> : null}
                </div>

                {showingActions && <ActionsMenu friendRequests={friendRequests} setFriendRequests={setFriendRequests} setChatrooms={setChatrooms} />}
              </div>
            </div>
            <UserChats setActiveChatroom={setActiveChatroom} chatrooms={chatrooms} loading={loading} />
          </div>
        </Sidebar>
        <ChatContainer>
          <Chatroom chat={chatrooms[activeChatroom]} setChatrooms={setChatrooms} setActiveChatroom={setActiveChatroom} />
        </ChatContainer>
      </Content>
    </StyledMain>
  );
};

export default Landing;

const StyledMain = styled.main`
  padding: 5rem;
  background-color: #2ab67b;
  color: var(--light);
  height: 100vh;

  @media (max-width: 800px) {
    padding: 0;
    height: auto;
  }
`;

const Content = styled.div`
  background-color: var(--dark);

  border-radius: 1rem;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr 2fr;

  height: calc(100vh-5rem);

  overflow: hidden;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    border-radius: 0;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2rem;
  padding: 4rem;

  & > .welcome-msg {
    font-size: 1.7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .logout-icon {
      font-size: 3rem;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: var(--danger);
      }
    }
  }

  & > .chats {
    margin-top: 2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    & > .chats-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > div {
        display: flex;
        gap: 2rem;

        position: relative;

        & > .actions-menu {
          position: relative;

          & > span {
            position: absolute;
            top: -1rem;
            left: 2rem;

            display: grid;
            place-items: center;
            aspect-ratio: 1/1;
            font-size: 1rem;
            border-radius: 50%;
            min-width: 3ch;
            color: var(--light);
            background-color: var(--danger);
            font-weight: 700;
          }
        }
      }

      & > h1 {
        font-size: 5rem;
        letter-spacing: 0.7rem;
      }

      & .icon {
        font-size: 3rem;
        cursor: pointer;
        transition: all 0.1s;
      }

      & .new-chat-icon:hover {
        color: var(--success);
      }
      & .more-icon:hover {
        color: var(--gray-light);
      }
    }
  }
`;

const ChatContainer = styled.div`
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1618%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(17%2c 39%2c 61%2c 1)'%3e%3c/rect%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(0%2c 0)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(0%2c 431.99999999999994)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(431.99999999999994%2c 0)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(431.99999999999994%2c 431.99999999999994)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(863.9999999999999%2c 0)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(863.9999999999999%2c 431.99999999999994)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(1295.9999999999998%2c 0)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1622' transform='translate(1295.9999999999998%2c 431.99999999999994)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1618'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cg id='SvgjsG1619'%3e%3cpath d='M10.37 1.49C6.23-0.01 1.95 1.29 0.82 4.41c-0.56 1.53-0.25 3.21 0.68 4.7l-1.23 3.39 4.56-0.35c0.45 0.24 0.92 0.46 1.43 0.64 4.14 1.51 8.42 0.2 9.55-2.92C16.94 6.75 14.51 3 10.37 1.49z' fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3cg id='SvgjsG1620'%3e%3cpath d='M17.1 5.86L7.64 9 2.41 0.51z m-3.03 8.32L10.93 9.07l5.69-1.9zM1.91 1.81l3.14 5.12L-0.64 8.83z'%3e%3c/path%3e%3cpath d='M9.89 9.39L7.18 10.29 5.67 7.86-1.08 10.09l14.71 5.35z'%3e%3c/path%3e%3c/g%3e%3cg id='SvgjsG1621'%3e%3cpath d='M9.3 6.66L2.88 0.14l0.26-0.73L9.76 6.17l-0.46 0.49zM5.17 9.75l3.39 1.23-1.1 3.03a0.95 0.95 0 0 0 1.8 0.66L10.36 11.64c0.27 0.1 0.36-0.07 0.43-0.28L11.61 9.1l-2.33-2.42-6.03-2.2-0.62-0.72a0.55 0.55 0 0 0-0.78-0.06c-0.23 0.2-0.26 0.54-0.06 0.78l0.97 1.15-2.14 5.89a0.95 0.95 0 0 0 1.79 0.66L3.25 9.87l0.62 3.33a0.96 0.96 0 0 0 1.12 0.77 0.97 0.97 0 0 0 0.76-1.13l-0.59-3.1z m4.62-3.59l2.11 2.15 0.17-0.48 2.08 0.76 1.36-1.37L11.05 2.68l-1.26 3.48z' fill-rule='evenodd'%3e%3c/path%3e%3c/g%3e%3cg id='SvgjsG1622'%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(0%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(0%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(0%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(0%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(0%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(0%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(0%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(0%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(0%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(0%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(43.199999999999996%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(43.199999999999996%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(43.199999999999996%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(43.199999999999996%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(43.199999999999996%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(43.199999999999996%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(43.199999999999996%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(43.199999999999996%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(43.199999999999996%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(43.199999999999996%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(86.39999999999999%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(86.39999999999999%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(86.39999999999999%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(86.39999999999999%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(86.39999999999999%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(86.39999999999999%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(86.39999999999999%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(86.39999999999999%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(86.39999999999999%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(86.39999999999999%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(129.6%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(129.6%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(129.6%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(129.6%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(129.6%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(129.6%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(129.6%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(129.6%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(129.6%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(129.6%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(172.79999999999998%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(172.79999999999998%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(172.79999999999998%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(172.79999999999998%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(172.79999999999998%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(215.99999999999997%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(215.99999999999997%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(215.99999999999997%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(215.99999999999997%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(215.99999999999997%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(259.2%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(259.2%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(259.2%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(259.2%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(259.2%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(259.2%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(259.2%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(259.2%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(259.2%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(259.2%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(302.4%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(302.4%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(302.4%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(302.4%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(345.59999999999997%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(345.59999999999997%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(345.59999999999997%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(345.59999999999997%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(345.59999999999997%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(345.59999999999997%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(345.59999999999997%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(345.59999999999997%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1621' transform='translate(345.59999999999997%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(345.59999999999997%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 0) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 43.199999999999996) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 86.39999999999999) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(388.79999999999995%2c 129.6) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(388.79999999999995%2c 172.79999999999998) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 215.99999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 259.2) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1620' transform='translate(388.79999999999995%2c 302.4) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(388.79999999999995%2c 345.59999999999997) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsG1619' transform='translate(388.79999999999995%2c 388.79999999999995) scale(1.2)' fill='rgba(51%2c 121%2c 194%2c 0.23)'%3e%3c/use%3e%3c/g%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
`;
