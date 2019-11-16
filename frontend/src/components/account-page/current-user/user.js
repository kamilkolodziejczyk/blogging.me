/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Spin } from 'antd';
import ImageUploader from '../../common/imageUploader';
import { userActions } from '../../../redux/actions';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

const CurrentUserAccountPage = props => {
  const [spinning, setSpinning] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [avatarImg, setAvatarImg] = useState('');
  const [following, setFollowing] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [blogs, setBlogs] = useState([]);
  const FormItem = Form.Item;

  useEffect(() => {
    props.getFollowing(localStorage.getItem('user_id'));
    props.getUserById(localStorage.getItem('user_id'));
    props.getBlogs(localStorage.getItem('user_id'));
  }, []);

  useEffect(
    () => {
      setSpinning(props.loading);
      if (props.user) {
        setFirstName(props.user.firstName);
        setLastName(props.user.lastName);
        setAvatarImg(props.user.avatar);
        setEmail(props.user.email);
        setImageUrl('');
      }
      if (props.following) {
        setFollowing(props.following);
      }
      if (props.blogs) {
        setBlogs(props.blogs);
      }
      if (props.error) {
        props.history.push('/');
        props.logout();
      }
    },
    [props.blogs, props.error, props.following, props.loading, props.user]
  );

  const saveUser = () => {
    props.editUser({ email, firstName, lastName, avatar: avatarImg });
  };
  const deleteBlog = blogId => {
    props.deleteUserBlog(blogId);
  };
  const unfollowUser = followingId => {
    props.unFollow(followingId);
  };

  return (
    <div className="account-wrapper">
      <Form>
        <Spin spinning={spinning} size="large">
          {props.user &&
            <ImageUploader
              firstName={props.user.firstName}
              lastName={props.user.lastName}
              changeImageUrl={setImageUrl}
              setAvatarImg={setAvatarImg}
              avatarImg={avatarImg}
              imageUrl={imageUrl}
            />}

          <Row align="middle" type="flex" justify="space-between" gutter={32}>
            <Col span={8}>
              <FormItem>
                <label>Your email:</label>
                <Input
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  size="large"
                  type="text"
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <label>Your first name:</label>
                <Input
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                  size="large"
                  type="text"
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <label>Your last name:</label>
                <Input
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                  size="large"
                  type="text"
                />
              </FormItem>
            </Col>
          </Row>
          <Row align="middle" type="flex" justify="end">
            <Col>
              <Button type="primary" onClick={saveUser}>
                Save
              </Button>
            </Col>
          </Row>

          <Row align="middle" type="flex" justify="space-between">
            <Col span={12}>
              <FormItem>
                <label>Your blogs:</label>
                <ul className="list">
                  {blogs.map(blog =>
                    <li key={blog._id}>
                      {blog.name}
                      <Button
                        onClick={() => deleteBlog(blog._id)}
                        shape="circle"
                        type="danger"
                        icon="minus"
                      />
                    </li>
                  )}
                </ul>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <label>Following:</label>
                <ul className="list">
                  {following.map(follow =>
                    <li key={follow._id}>
                      <Link to={`/account/${follow._id}`}>
                        {follow.firstName} {follow.lastName}
                      </Link>
                      <Button
                        onClick={() => unfollowUser(follow._id)}
                        type="danger"
                      >
                        Unfollow
                      </Button>
                    </li>
                  )}
                </ul>
              </FormItem>
            </Col>
          </Row>
        </Spin>
      </Form>
    </div>
  );
};

function mapState(state) {
  const { user, error, loading, following, blogs } = state.user;
  return { user, error, loading, following, blogs };
}

const actionCreators = {
  deleteUserBlog: userActions.deleteUserBlog,
  getFollowing: userActions.getFollowing,
  getUserById: userActions.getUserById,
  getBlogs: userActions.getBlogs,
  editUser: userActions.editUser,
  unFollow: userActions.unFollow,
  logout: userActions.logout
};

export default connect(mapState, actionCreators)(
  withRouter(CurrentUserAccountPage)
);
