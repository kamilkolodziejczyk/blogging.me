import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class HomePage extends Component {
  componentDidMount() {
    if (!localStorage.getItem('token')) this.props.history.push('/');
  }
  render() {
    return <h1>Home</h1>;
  }
}

export default withRouter(HomePage);
