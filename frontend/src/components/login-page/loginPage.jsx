import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Icon, Input, Button, notification, Spin } from 'antd';
import Api from '../../endpoints';
import axios from 'axios';

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    loading: false
  };
  componentDidMount() {
    if (localStorage.getItem('token')) this.props.history.push('/home');
  }
  handleLogin = () => {
    this.setState({ loading: true });
    axios
      .post(Api.USER_LOGIN, {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        this.setState({ email: '', password: '' });
        localStorage.setItem('user_id', res.data.user._id);
        localStorage.setItem('user_firstName', res.data.user.firstName);
        this.props.changeNavbarVisible();
        localStorage.setItem('token', res.data.token);
        this.props.updateBlogs();
        this.setState({ loading: false });
        this.props.history.push('/home');
      })
      .catch(err => {
        this.setState({ loading: false });
        notification['error']({
          message: err.response.data
        });
      });
  };
  render() {
    const FormItem = Form.Item;
    return (
      <div className='form-wrapper login-wrapper'>
        <Spin spinning={this.state.loading} size='large'>
          <Form className='form'>
            <h1>blogging.me</h1>
            <FormItem>
              <Input
                prefix={
                  <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='Email'
                size='large'
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormItem>
            <FormItem>
              <Input
                prefix={
                  <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='Password'
                type='password'
                size='large'
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormItem>
            <FormItem>
              <Button
                onClick={this.handleLogin}
                type='primary'
                htmlType='submit'
                size='large'
                className='form-button'
              >
                <Icon type='login' />
                Log in
              </Button>
              Or <Link to='/register'>register now!</Link>
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default withRouter(LoginPage);
