import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import 'babel-polyfill';

import CustomButton from '../../components/customButton';
import CustomInput from '../../components/customInput';
import CustomAlert from '../../components/customAlert';
import componentStyles from '../../constants/componentStyles';
import formValidation from '../../helpers/formValidation';
import validationSchema from '../../constants/auth/validationSchema';

import { authApi } from '../../api';

function AuthContainer() {
  const [formData, setFormData] = useState({
    email: { value: '', isValid: true, invalidFeedback: '' },
    password: { value: '', isValid: true, invalidFeedback: '' }
  });

  const [alert, setAlert] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = async event => {
    const { name: propName, value: propValue } = event.target;

    const validatedProp = await formValidation.validateOnChange(validationSchema, propName, propValue);

    setFormData({
      ...formData,
      ...validatedProp
    });
  };

  const logIn = async data => {
    try {
      await authApi.logIn(data);

      setAlert({
        variant: componentStyles.success,
        heading: 'Log In',
        mainText: 'You are logged in.',
        isShown: setShowAlert
      });
    } catch (err) {
      setAlert({
        variant: componentStyles.error,
        heading: 'Log In',
        mainText: 'An error occured while trying to log in.',
        isShown: setShowAlert
      });
    } finally {
      setShowAlert(true);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const validatedForm = formValidation.validateOnSubmit(formData);

    if (!validatedForm.isValid) {
      setAlert({ ...validatedForm.alertData, isShown: setShowAlert });
      setShowAlert(true);
    } else {
      const data = {
        email: formData.email.value,
        password: formData.password.value
      };
      logIn(data);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <CustomInput
          label="Email"
          type="text"
          name="email"
          value={formData.email.value}
          placeholder="Enter your email"
          invalidFeedback={formData.email.invalidFeedback}
          isValid={formData.email.isValid}
          onChange={handleChange}
        />
        <CustomInput
          label="Password"
          type="password"
          name="password"
          value={formData.password.value}
          placeholder="Enter your password"
          invalidFeedback={formData.password.invalidFeedback}
          isValid={formData.password.isValid}
          onChange={handleChange}
        />
        <CustomButton variant={componentStyles.default} type="submit" text="Log in" />
      </Form>
      {showAlert && <CustomAlert {...alert} />}
    </Container>
  );
}

export default AuthContainer;
