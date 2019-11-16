import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Spin, Row, Col, Card, Avatar, Button } from 'antd';
import { connect } from 'react-redux';
import { userActions } from './../../../redux/actions/user.actions';

const SearchUserAccountPage = props => {
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(
    () => {
      props.getUserById(props.match.params.id);
      props.getFollowing(props.match.params.id);
      props.getBlogs(props.match.params.id);
    },
    [props.match]
  );

  useEffect(
    () => {
      setSpinning(props.loading);
      //   console.log(following);
      //   if (props.following) {
      //     setFollowing(props.following);
      //   }
      //   if (props.blogs) {
      //     setBlogs(props.blogs);
      //   }
      //   if (props.error) {
      //     props.history.push('/');
      //     props.logout();
      //   }
    },
    [props.blogs, props.error, props.following, props.loading, props.user]
  );
  const unfollowUser = followingId => {
    props.unFollow(followingId);
  };

  return (
    <div style={{ margin: 20, textAlign: 'center' }}>
      <Spin spinning={spinning} size="large">
        {props.user &&
          <React.Fragment>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={4}>
                <Avatar
                  size={64}
                  src={props.user.avatar ? props.user.avatar : ''}
                  icon={props.user.avatar ? '' : 'user'}
                />
              </Col>
              <Col span={4}>
                <Button type="primary">Follow</Button>
              </Col>
            </Row>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={4}>
                <label>First name: </label>
                <p>
                  {props.user.firstName}
                </p>
              </Col>
              <Col span={4}>
                <label>Last name: </label>
                <p>
                  {props.user.lastName}
                </p>
              </Col>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <Col span={10}>
                <Card title="Blogs">
                  {props.blogs &&
                    props.blogs.map(blog =>
                      <p key={blog._id}>
                        {blog.name}
                      </p>
                    )}
                </Card>
              </Col>
              <Col span={10}>
                <Card title="Followings">
                  {props.following &&
                    props.following.map(foll =>
                      <p key={foll._id}>
                        <Link to={`/account/${foll._id}`}>
                          {foll.firstName} {foll.lastName}
                        </Link>
                      </p>
                    )}
                </Card>
              </Col>
            </Row>
          </React.Fragment>}
      </Spin>
    </div>
  );
};

function mapState(state) {
  const { user, error, loading, following, blogs } = state.user;
  return { user, error, loading, following, blogs };
}

const actionCreators = {
  getFollowing: userActions.getFollowing,
  getUserById: userActions.getUserById,
  getBlogs: userActions.getBlogs,
  unFollow: userActions.unFollow,
  logout: userActions.logout
};

export default connect(mapState, actionCreators)(
  withRouter(SearchUserAccountPage)
);
