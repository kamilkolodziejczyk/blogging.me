import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PostForm from '../post/postForm';

class HomePage extends Component {
  componentDidMount() {
    if (!localStorage.getItem('token')) this.props.history.push('/');
  }
  render() {
    return (
      <div>
        <PostForm logout={this.props.logout} />
      </div>
    );
  }
}

export default withRouter(HomePage);
