import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class HomePage extends Component {
  componentDidMount() {
    if (!localStorage.getItem('token')) this.props.history.push('/');
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

export default withRouter(HomePage);
