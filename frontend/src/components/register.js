import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Spin, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { userActions } from '../redux/actions';
import FormWrapper from './common/styled-components/formWrapper';

const Register = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegisterSubmit = () => {
    props.register({ email, password, firstName, lastName });
  };

  useEffect(() => {
    setLoading(props.loading);
    if (props.error) {
      notification.error({ message: props.error.response.data });
    }
    if (props.registeredIn || localStorage.getItem('token'))
      props.history.push('/home');
  }, [props.loading, props.error, props.history, props.registeredIn]);

  return (
    <FormWrapper>
      <Form className='form'>
        <Spin spinning={loading} size='large'>
          <h1>Login to blogging.me</h1>
          <Form.Item>
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder='First name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder='Last name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='form-button'
              onClick={onRegisterSubmit}
            >
              Register
            </Button>
          </Form.Item>
        </Spin>
      </Form>
    </FormWrapper>
  );
};

function mapState(state) {
  const { loading, user, registeredIn, error } = state.user;
  return { loading, user, registeredIn, error };
}

const actionCreators = {
  register: userActions.register
};

export default connect(
  mapState,
  actionCreators
)(withRouter(Register));
