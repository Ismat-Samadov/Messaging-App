import styled from 'styled-components';
import { Formik, Form, useField } from 'formik';
import useAxios from 'axios-hooks';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Color from 'color';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { BeatLoader } from 'react-spinners';

const ChatForm = ({ chatId, setChatrooms }) => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [{ loading }, sendMessage] = useAxios(
    {
      url: `${import.meta.env.VITE_API_URL}/messages`,
      method: 'POST'
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      if (values.file) formData.append('file', values.file[0]);
      formData.append('chatroom', chatId);
      formData.append('content', values.content);

      const res = await sendMessage({
        data: formData,
        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`, Authorization: authHeader, Accept: 'application/json' }
      });
      setSubmitting(false);
      resetForm();
      setChatrooms((chatrooms) =>
        chatrooms.reduce((acc, val) => {
          if (val._id.toString() !== chatId) {
            acc.push(val);
          } else {
            acc.unshift({ ...val, messages: [{ ...res.data, author: auth }, ...val.messages] });
          }
          return acc;
        }, [])
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormWrapper>
      <Formik
        initialValues={{
          content: ''
        }}
        validationSchema={Yup.object({
          content: Yup.string().required('Required'),
          file: Yup.mixed()
            .test('fileType', 'Bad Format', (value) => {
              if (value && value[0]) {
                return value[0].type === 'image/jpeg' || value[0].type === 'image/jpg' || value[0].type === 'image/png';
              } else {
                return true;
              }
            })
            .test('fileSize', 'Too Big', (value) => {
              if (value && value[0]) {
                // 800 kb
                return value[0].size < 800 * 1000;
              } else {
                return true;
              }
            })
        })}
        onSubmit={handleSubmit}
      >
        <Form style={formCSS}>
          <Input name="content" type="text" placeholder="Type your message..." />
          <FileInput name="file" type="file" id="file" label={<Icon icon="ph:paperclip-bold" />} />
          <SubmitButton type="submit">
            {loading ? (
              <BeatLoader loading={loading} cssOverride={{ display: 'block', margin: '0 auto' }} color="var(--light)" size={5} />
            ) : (
              <Icon icon="ph:paper-plane-right-fill" />
            )}
          </SubmitButton>
        </Form>
      </Formik>
    </FormWrapper>
  );
};

ChatForm.propTypes = {
  chatId: PropTypes.string,
  setChatrooms: PropTypes.func
};

export default ChatForm;

const formCSS = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  alignItems: 'center',
  gap: '1rem'
};

const FormWrapper = styled.div`
  padding: 1rem;
  height: 10rem;
`;

const SubmitButton = styled.button`
  font-size: 1.5rem;
  align-self: stretch;
  display: flex;
  align-items: center;
  background-color: ${Color('#11273d').lighten(1.5).hex()};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${Color('#11273d').lighten(3).hex()};
  }
`;

const Input = ({ label, ...props }) => {
  const [field] = useField(props);

  return (
    <>
      <FormGroup>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input {...field} {...props} />
      </FormGroup>
    </>
  );
};
Input.propTypes = {
  label: PropTypes.any,
  id: PropTypes.string,
  name: PropTypes.string
};
const FileInput = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <>
      <FormGroup>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input
          {...field}
          {...props}
          value={undefined}
          onChange={(event) => {
            if (event.currentTarget.files) {
              helpers.setValue(event.currentTarget.files);
            }
          }}
        />
        {meta.error && <span>{meta.error}</span>}
      </FormGroup>
    </>
  );
};
FileInput.propTypes = {
  label: PropTypes.any,
  id: PropTypes.string,
  name: PropTypes.string
};

const FormGroup = styled.div`
  display: flex;
  gap: 1rem;
  font-family: 'Montserrat';
  letter-spacing: 1px;

  &:has(label[for='file']) {
    font-size: 1.5rem;
    align-self: stretch;
    display: flex;
    align-items: center;
    background-color: ${Color('#11273d').lighten(1.5).hex()};
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 8px;
    padding: 0.6em 1.2em;

    &:hover {
      background-color: ${Color('#11273d').lighten(3).hex()};
    }
  }

  & label {
    font-size: 1.7rem;

    &[for='file'] {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }

  & input {
    flex-grow: 1;
    background-color: var(--light);
    padding: 1rem 2rem;
    border: 1px solid var(--dark);
    border-radius: 1rem;
    color: var(--dark);
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 1.5rem;
    min-width: 30rem;

    &[type='file'] {
      display: none;
    }
  }
`;
