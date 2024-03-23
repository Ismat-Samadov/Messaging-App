import Modal from 'react-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import useAxios from 'axios-hooks';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NewChatMenu = ({ isOpen, closeModal, setChatrooms }) => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const [participants, setParticipants] = useState([]);

  const [{ data, loading }] = useAxios({
    url: `${import.meta.env.VITE_API_URL}/users/${auth._id}/friends`,
    method: 'GET',
    headers: { Authorization: authHeader }
  });

  const [, createGroupChat] = useAxios(
    { url: `${import.meta.env.VITE_API_URL}/chatrooms`, method: 'POST', headers: { Authorization: authHeader } },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (participants.length < 2) return setErrors({ participants: 'Your group chat must have at least 3 participants' });
      const res = await toast.promise(createGroupChat({ data: { participants: [auth._id, ...participants], title: values.title } }), {
        loading: 'Creating Chatroom...',
        success: 'Created Group Chat!',
        error: 'Something went wrong'
      });
      setChatrooms((chatrooms) => [res.data.newChatroom, ...chatrooms]);
      closeModal();
      setSubmitting(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ position: 'absolute' }} onClick={(e) => e.stopPropagation()}>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyles}>
        <ModalContainer>
          <h1>Create New Group Chat</h1>
          <div className="body">
            <Formik
              initialValues={{
                title: '',
                participants: ''
              }}
              validationSchema={Yup.object({
                title: Yup.string().required('Required')
              })}
              onSubmit={handleSubmit}
            >
              <Form style={{ display: 'flex', flexDirection: 'column' }}>
                <Input label="Title" name="title" id="title" type="text" placeholder="New Group Chat" />
                <FriendsList friends={!loading && data ? data.friends : []} participants={participants} setParticipants={setParticipants} />
                <SubmitButton type="submit">Create</SubmitButton>
              </Form>
            </Formik>
          </div>
        </ModalContainer>
      </Modal>
    </div>
  );
};

NewChatMenu.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  setChatrooms: PropTypes.func
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem;
  min-height: 50vh;
  & h1 {
    font-weight: 700;
    font-family: 'Montserrat';
    font-size: 4rem;
    letter-spacing: 3px;
  }
  & > .body {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

const EmptyMessage = styled.span`
  font-size: 2rem;
  color: var(--dark);
  text-align: center;
`;
const SubmitButton = styled.button`
  font-size: 2rem;
  align-self: center;
  margin-top: 4rem;
  background-color: var(--success);
`;

export default NewChatMenu;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  font-family: 'Montserrat';
  letter-spacing: 1px;
  position: relative;

  & label {
    font-size: 1.7rem;
  }

  & input {
    background-color: #fff;
    padding: 1rem 2rem;
    border: 2px solid var(--dark);
    border-radius: 1rem;
    color: var(--dark);
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 1.5rem;
    min-width: 30rem;

    &:focus {
      outline: none;
      border-color: var(--info);
    }
  }

  & .icon {
    font-size: 3rem;
    transition: all 0.1s;
  }

  & .search-icon {
    position: absolute;
    top: 15%;
    right: 5%;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 1.2rem;
  font-weight: 500;
`;

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <FormGroup>
        <label htmlFor={props.id}>{label}</label>
        <input {...field} {...props} />
        {meta.touched && meta.error ? <ErrorMessage>{meta.error}</ErrorMessage> : null}
      </FormGroup>
    </>
  );
};
Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
};

const FriendsList = ({ friends, participants, setParticipants }) => {
  const handleClick = (user) => {
    if (!participants.includes(user._id)) return setParticipants((participants) => [...participants, user._id]);
    setParticipants((participants) => participants.filter((e) => e !== user._id));
  };

  return (
    <Container>
      <Input type="hidden" name="participants" label="Participants" />
      <UsersContainer>
        {friends.map((e) => {
          const selected = participants.includes(e.user._id);
          return (
            <User key={e._id} className={selected ? 'selected' : null}>
              {e.user.username}
              <Icon onClick={() => handleClick(e.user)} icon={selected ? 'ph:x-bold' : 'ph:plus-bold'} />
            </User>
          );
        })}
        {friends.length === 0 ? <EmptyMessage>Nothing to see here...</EmptyMessage> : null}
      </UsersContainer>
    </Container>
  );
};

FriendsList.propTypes = {
  friends: PropTypes.array,
  participants: PropTypes.array,
  setParticipants: PropTypes.func
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const UsersContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const User = styled.span`
  padding: 1rem 2rem;
  background-color: var(--dark);
  font-size: 1.3rem;
  color: var(--light);
  border-radius: 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;

  transition: all 0.3s;

  &.selected {
    background-color: var(--info);
  }

  & > svg {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: rotate(90deg);
    }
  }
`;
