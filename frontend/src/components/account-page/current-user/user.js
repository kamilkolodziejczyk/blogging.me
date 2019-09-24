import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import endpoints from '../../../endpoints';
import ImageUploader from '../../common/imageUploader';
import { userActions } from '../../../redux/actions';

const CurrentUserAccountPage = props => {
  const FormItem = Form.Item;
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [avatarImg, setAvatarImg] = useState('');
  const [lastName, setLastName] = useState('');
  const [following, setFollowing] = useState([]);
  const [spinning, setSpinning] = useState(false);

  const saveUser = () => {};
  const deleteBlog = () => {};
  const unfollowUser = () => {};

  useEffect(() => {
    props.getUserById(localStorage.getItem('user_id'));
    props.getFollowing(localStorage.getItem('user_id'));
  }, []);

  useEffect(() => {
    setSpinning(props.loading);
    if (props.user) {
      setAvatarImg(props.user.avatarImg);
      setEmail(props.user.email);
      setFirstName(props.user.firstName);
      setLastName(props.user.lastName);
    }
    if (props.following) {
      setFollowing(props.following);
    }
  }, [props.loading, props.user]);

  return (
    <div className='account-wrapper'>
      <Form>
        <Spin spinning={spinning} size='large'>
          {props.user && (
            <ImageUploader
              avatarImg={avatarImg}
              setAvatarImg={setAvatarImg}
              firstName={firstName}
              lastName={lastName}
            />
          )}

          <Row align='middle' type='flex' justify='space-between' gutter={32}>
            <Col span={8}>
              <FormItem>
                <label>Your email:</label>
                <Input
                  size='large'
                  type='text'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <label>Your first name:</label>
                <Input
                  size='large'
                  type='text'
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <label>Your last name:</label>
                <Input
                  size='large'
                  type='text'
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </FormItem>
            </Col>
          </Row>
          <Row align='middle' type='flex' justify='end'>
            <Col>
              <Button type='primary' onClick={saveUser}>
                Save
              </Button>
            </Col>
          </Row>

          <Row align='middle' type='flex' justify='space-between'>
            <Col span={12}>
              <FormItem>
                {/* <label>Your blogs:</label>
                <ul className='list'>
                  {props.blogs.map(blog => (
                    <li key={blog._id}>
                      {blog.name}
                      <Button
                        type='danger'
                        shape='circle'
                        icon='minus'
                        onClick={() => deleteBlog(blog._id)}
                      />
                    </li>
                  ))}
                </ul> */}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <label>Following:</label>
                <ul className='list'>
                  {following.map(follow => (
                    <li key={follow._id}>
                      {follow.firstName} {follow.lastName}
                      <Button
                        onClick={() => unfollowUser(follow._id)}
                        type='danger'
                      >
                        Unfollow
                      </Button>
                    </li>
                  ))}
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
  const { user, error, loading, following } = state.user;
  return { user, error, loading, following };
}

const actionCreators = {
  getUserById: userActions.getUserById,
  getFollowing: userActions.getFollowing
};

export default connect(
  mapState,
  actionCreators
)(withRouter(CurrentUserAccountPage));
