import React, { Component } from 'react';
import { Form, Icon, Input, Button, notification } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import Api from '../../endpoints';
import axios from 'axios';

class RegisterPage extends Component {
  state = {
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  };
  componentDidMount() {
    if (localStorage.getItem('token')) this.props.history.push('/home');
  }
  handleRegister = () => {
    const { email, password, firstName, lastName } = this.state;
    axios
      .post(Api.USER_REGISTRATION, {
        email,
        password,
        firstName,
        lastName
      })
      .then(res => {
        this.setState({ email: '', password: '', firstName: '', lastName: '' });
        this.props.changeNavbarVisible();
        localStorage.setItem('user_id', res.data.user._id);
        localStorage.setItem('user_firstName', res.data.user.firstName);
        localStorage.setItem('token', res.data.token);
        this.props.history.push('/home');
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
      });
  };
  render() {
    const FormItem = Form.Item;
    return (
      <div className='form-wrapper'>
        <Form className='form'>
          <Link to='/'>
            <Button type='primary'>Back</Button>
          </Link>
          <h1>blogging.me</h1>
          <FormItem>
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
              size='large'
              onChange={e => this.setState({ email: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Password'
              type='password'
              size='large'
              onChange={e => this.setState({ password: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Input
              placeholder='First name'
              size='large'
              onChange={e => this.setState({ firstName: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Input
              placeholder='Last name'
              size='large'
              onChange={e => this.setState({ lastName: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Button
              onClick={this.handleRegister}
              type='primary'
              htmlType='submit'
              size='large'
              className='form-button'
            >
              Register
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default withRouter(RegisterPage);
