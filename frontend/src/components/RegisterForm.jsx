import { Formik, Form, useField } from 'formik';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import * as Yup from 'yup';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const FormWrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
  background-color: #3e3e3e;
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

const RegisterForm = () => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const [{ data }, executeRegister] = useAxios({ url: `${import.meta.env.VITE_API_URL}/register`, method: 'POST' }, { manual: true });

  if (data) {
    signIn({
      auth: {
        token: data.token,
        type: 'Bearer'
      },
      userState: data.user
    });
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await toast.promise(
        executeRegister({ data: { username: values.username, email: values.email, password: values.password } }),
        {
          loading: 'Creating Account...',
          success: 'Account Created! Redirecting...',
          error: 'Something went wrong'
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
          }
        }
      );
      setSubmitting(false);
    } catch (err) {
      if (err?.response && err?.response.data.type === 'bodyValidation') {
        const errors = {};
        err.response.data.err.forEach((el) => {
          errors[el.path] = el.msg;
        });
        setErrors(errors);
      }
      console.log(err.message);
    }
  };

  return (
    <>
      {isAuthenticated() ? <Navigate to="/" /> : null}
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object({
          username: Yup.string()
            .required('Required')
            .min(3, 'Username must be at least 3 characters long')
            .max(15, 'Username must be less than 15 characters long'),
          email: Yup.string().required('Required').email('Must be a valid email address'),
          password: Yup.string().required('Required').min(6, 'Must be at least 6 characters long'),
          confirmPassword: Yup.string()
            .required('Required')
            .min(6, 'Must be at least 6 characters long')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
        })}
        onSubmit={handleSubmit}
      >
        <FormWrapper>
          <Form style={formCSS}>
            <Input label="Username" name="username" type="text" placeholder="JohnDoe" />
            <Input label="Email" name="email" type="email" placeholder="johndoe@gmail.com" />
            <Input label="Password" name="password" type="password" />
            <Input label="Confirm Password" name="confirmPassword" type="password" />
            <SubmitButton type="submit">Register</SubmitButton>
            <RegisterLink to="/login">Already have an account? Log In</RegisterLink>
          </Form>
        </FormWrapper>
      </Formik>
    </>
  );
};

export default RegisterForm;
