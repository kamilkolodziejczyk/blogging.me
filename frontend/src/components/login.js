import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Spin, notification } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { userActions } from '../redux/actions';
import FormWrapper from './common/styled-components/formWrapper';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginSubmit = () => {
    props.login(email, password);
  };

  useEffect(() => {
    setLoading(props.loading);
    if (props.error) {
      notification.error({ message: props.error.response.data });
    }
    if (props.loggedIn || localStorage.getItem('token')) {
      props.history.push('/home');
    }
  }, [props.loading, props.error, props.loggedIn, props.history]);

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
            <Button
              type='primary'
              htmlType='submit'
              className='form-button'
              onClick={onLoginSubmit}
            >
              Log in
            </Button>
            Or <Link to='/register'>register now!</Link>
          </Form.Item>
        </Spin>
      </Form>
    </FormWrapper>
  );
};

function mapState(state) {
  const { user, loading, error, loggedIn } = state.user;
  return { user, loading, error, loggedIn };
}

const actionCreators = {
  login: userActions.login
};

export default connect(
  mapState,
  actionCreators
)(withRouter(Login));