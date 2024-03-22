import { Formik, Form, useField } from 'formik';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import * as Yup from 'yup';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const FormWrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
  background-color: #3e3e3e;

  @media (max-width: 800px) {
    align-items: start;
    padding: 10rem 3rem;

    & form {
      justify-content: center;
      grid-auto-rows: 1fr;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  font-family: 'Montserrat';
  letter-spacing: 1px;

  & label {
    font-size: 1.7rem;
  }

  & input {
    background-color: #fff;
    padding: 1rem 2rem;
    border: 1px solid var(--dark);
    border-radius: 0.25rem;
    color: var(--dark);
    font-family: 'Montserrat';
    font-weight: 400;
    font-size: 1.5rem;
    min-width: 30rem;
  }
`;

const SubmitButton = styled.button`
  font-size: 1.5rem;
  align-self: center;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 1.2rem;
  font-weight: 500;
`;

const RegisterLink = styled(Link)`
  font-size: 1.5rem;
  margin-top: 2rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--dark-hover);
    text-underline-offset: 5px;
  }
`;

const formCSS = {
  padding: '5rem',
  backgroundColor: 'var(--light)',
  border: '1px solid var(--dark)',
  borderRadius: '.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const Input = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <FormGroup>
        <label htmlFor={props.id || props.name}>{label}</label>
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

const LoginForm = () => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const [{ data }, executeLogin] = useAxios({ url: `${import.meta.env.VITE_API_URL}/login`, method: 'POST' }, { manual: true });
  const location = useLocation();

  if (data) {
    signIn({
      auth: {
        token: data.token,
        type: 'Bearer'
      },
      userState: data.user
    });
  }

  const demoLogin = async () => {
    try {
      toast.promise(
        executeLogin({ data: { username: import.meta.env.VITE_DEMO_USERNAME, password: import.meta.env.VITE_DEMO_PASS } }),
        {
          loading: 'Logging in...',
          success: 'Logged In! Redirecting...',
          error: (err) => (err.response ? 'Wrong Username/Password' : 'Something went wrong')
        },
        {
          style: {
            marginTop: '3rem',
            fontSize: '1.5rem'
          },
          success: {
            duration: 3000
          },
          error: {
            duration: 5000
          },
          id: 'loginAttempt'
        }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      toast.promise(
        executeLogin({ data: { username: values.username, password: values.password } }),
        {
          loading: 'Logging in...',
          success: 'Logged In! Redirecting...',
          error: (err) => (err.response ? 'Wrong Username/Password' : 'Something went wrong')
        },
        {
          style: {
            marginTop: '3rem',
            fontSize: '1.5rem'
          },
          success: {
            duration: 3000
          },
          error: {
            duration: 5000
          },
          id: 'loginAttempt'
        }
      );
      setSubmitting(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {isAuthenticated() && <Navigate to={location.state ? location.state.pathname : '/'} />}
      <Formik
        initialValues={{
          username: '',
          password: ''
        }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          password: Yup.string().required('Required')
        })}
        onSubmit={handleSubmit}
      >
        <FormWrapper>
          <Form style={formCSS}>
            <Input label="Username or Email" name="username" type="text" placeholder="johndoe@gmail.com" />
            <Input label="Password" name="password" type="password" />
            <SubmitButton type="submit">Log In</SubmitButton>
            <RegisterLink to="/register">New to our site? Create an account</RegisterLink>
            <RegisterLink onClick={demoLogin}>Try the demo account</RegisterLink>
          </Form>
        </FormWrapper>
      </Formik>
    </>
  );
};

export default LoginForm;
