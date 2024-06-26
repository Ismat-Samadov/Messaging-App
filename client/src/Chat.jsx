// import sendArrow from './assets/send-arrow.svg';
import { useContext, useEffect, useRef, useState } from 'react';
// import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import axios from 'axios';
import Contact from './Contact';

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setUseMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const divUnderMessages = useRef();
  useEffect(() => {
    connectToWs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function connectToWs() { 
    const ws = new WebSocket('wss://messaging-app-i1kr.onrender.com');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('disconnected');
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
    console.log(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      setMessages(prev => [...prev, { ...messageData }]);
    }
  }

  function logout() {
    axios.post('/logout').then(() => {
      setId(null);
      setUsername(null);
    });
  }

  function sendMessage(ev) {
    ev.preventDefault();

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setUseMessageText('');
    setMessages(prev => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/' + selectedUserId).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className='flex h-screen'>
      <div className='bg-white w-1/3 pl-4 pt-4 flex flex-col'>
        <div className='flex-grow'>
          <Logo />

          {Object.keys(onlinePeopleExclOurUser).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => {
                setSelectedUserId(userId);
                console.log({ userId });
              }}
              selected={userId === selectedUserId}
            />
          ))}
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
        <div className='p-3 text-center'>
          <span>Welcome {username} </span>
          <button
            onClick={logout}
            className='text-sm bg-blue-300 py-1 px-2 rounded-md border text-gray-700'
          >
            Logout
          </button>
        </div>
      </div>
      <div className='bg-blue-300 w-2/3 flex flex-col'>
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex h-full items-center justify-center'>
              <div className='text-gray-800'>&larr; select from sidebar</div>
            </div>
          )}
          {!!selectedUserId && (
            <div className='relative h-full'>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {messagesWithoutDupes.map(message => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? 'text-right' : 'text-left'
                    }
                  >
                    <div
                      className={
                        'text-left inline-block p-2 m-2 rounded-md text-sm ' +
                        (message.sender === id
                          ? 'bg-blue-700 text-white'
                          : 'bg-white text-blue-500')
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div className='h-12' ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className='flex gap-2 p-2' onSubmit={sendMessage}>
            <input
              type='text'
              value={newMessageText}
              onChange={ev => setUseMessageText(ev.target.value)}
              className='bg-white border p-2 rounded-sm flex-grow'
              placeholder='type your message here'
            />
            <button
              type='submit'
              className='bg-blue-500 p-2 rounded-sm text-white'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
