import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Form, Icon, Input, Button, notification, Spin } from 'antd';
import axios from 'axios';
import Api from '../../endpoints';

import { userActions } from './../../redux/actions/user.actions';

const LoginPage = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const FormItem = Form.Item;

  useEffect(() => {
    if (localStorage.getItem('token')) props.history.push('/home');
  });

  const handleLogin = () => {
    props.login(email, password);
  };

  return (
    <div className="form-wrapper">
      <Spin spinning={loading} size="large">
        <Form className="form">
          <h1>blogging.me</h1>
          <FormItem>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              size="large"
              onChange={e => setEmail(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
              type="password"
              size="large"
              onChange={e => setPassword(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Button
              onClick={handleLogin}
              type="primary"
              htmlType="submit"
              size="large"
              className="form-button"
            >
              <Icon type="login" />
              Log in
            </Button>
            Or <Link to="/register">register now!</Link>
          </FormItem>
        </Form>
      </Spin>
    </div>
  );
};

function mapState(state) {
  const { loggingIn } = state.authentication;
  return { loggingIn };
}
const actionCreators = {
  login: userActions.login,
  logout: userActions.logout
};

export default connect(mapState, actionCreators)(withRouter(LoginPage));
