import Modal from 'react-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import useAxios from 'axios-hooks';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { ClipLoader } from 'react-spinners';

import UsersList from './UsersList';

const FriendsMenu = ({ isOpen, closeModal }) => {
  const authHeader = useAuthHeader();

  const [{ loading, data }, executeSearch] = useAxios(
    {
      url: `${import.meta.env.VITE_API_URL}/users/search`,
      method: 'POST',
      headers: { Authorization: authHeader }
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await executeSearch({ data: { username: values.username.trim() } });
      setSubmitting(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ position: 'absolute' }} onClick={(e) => e.stopPropagation()}>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyles}>
        <ModalContainer>
          <h1>Find New Friends</h1>
          <div className="form">
            <Formik
              initialValues={{
                username: ''
              }}
              validationSchema={Yup.object({
                username: Yup.string().required('Required')
              })}
              onSubmit={handleSubmit}
            >
              <Form>
                <Input label="Username" name="username" id="username" type="text" placeholder="XxVampireSlayerxX" />
              </Form>
            </Formik>
          </div>
          <div className="body">
            <ClipLoader cssOverride={{ margin: '0 auto', alignSelf: 'center', display: 'inline-block' }} loading={loading} color="var(--dark)" size={75} />
            {!loading ? <UsersList data={data} /> : null}
          </div>
        </ModalContainer>
      </Modal>
    </div>
  );
};

FriendsMenu.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func
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
    justify-content: center;
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
    border: 2px solid var(--success);
    border-radius: 1rem;
    color: var(--dark);
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 1.5rem;
    min-width: 30rem;
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

const Input = ({ label, ...props }) => {
  const [field] = useField(props);
  return (
    <>
      <FormGroup>
        <input {...field} {...props} />
        <Icon className="search-icon icon" icon="ph:magnifying-glass-bold" />
      </FormGroup>
    </>
  );
};
Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
};

export default FriendsMenu;
