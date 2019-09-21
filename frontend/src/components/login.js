import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Spin, notification } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { userActions } from '../redux/actions';

const LoginWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    text-align: center;
  }
  .login-form {
    width: 40%;
    padding: 20px;
    border: 1px solid black;
    border-radius: 4px;
    -webkit-box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
    box-shadow: 6px 4px 28px -11px rgba(0, 0, 0, 0.75);
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
`;

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
  }, [props.loading, props.error]);

  return (
    <LoginWrapper>
      <Form className='login-form'>
        <Spin spinning={loading} size='large'>
          <h1>blogging.me</h1>
          <Form.Item>
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Username'
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
              className='login-form-button'
              onClick={onLoginSubmit}
            >
              Log in
            </Button>
            Or <Link to='/register'>register now!</Link>
          </Form.Item>
        </Spin>
      </Form>
    </LoginWrapper>
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
