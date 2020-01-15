import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Spin, Row, Col, Card, Avatar, Button } from 'antd';
import { connect } from 'react-redux';
import { userActions } from './../../../redux/actions/user.actions';

const SearchUserAccountPage = props => {
  const [spinning, setSpinning] = useState(false);

  useEffect(
    () => {
      props.getUserById(localStorage.getItem('user_id'));
      props.getFollowerById(props.match.params.id);
      props.getFollowing(props.match.params.id);
      props.getBlogs(props.match.params.id);
    },
    [props.match, props.follow]
  );
  useEffect(
    () => {
      setSpinning(props.loading);
      if (props.error) {
        props.history.push('/');
        props.logout();
      }
    },
    [props.error, props.loading]
  );

  const handleFollowButton = () => {
    props.user.following.findIndex(f => f === props.follower._id) === -1
      ? props.follow(props.follower.email)
      : props.unFollow(props.match.params.id);
  };

  return (
    <div style={{ textAlign: 'center' }} className="search-user-wrapper">
      <Spin spinning={spinning} size="large">
        {props.follower &&
          <React.Fragment>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={4}>
                <Avatar
                  size={64}
                  src={props.follower.avatar ? props.follower.avatar : ''}
                  icon={props.follower.avatar ? '' : 'user'}
                />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={handleFollowButton}>
                  {props.user &&
                  props.user.following.findIndex(
                    f => f === props.follower._id
                  ) === -1
                    ? 'Obserwuj'
                    : 'Przestań obserwować'}
                </Button>
              </Col>
            </Row>
            <Row type="flex" justify="space-around" align="middle">
              <Col span={4}>
                <label>Imie: </label>
                <p>
                  {props.follower.firstName}
                </p>
              </Col>
              <Col span={4}>
                <label>Nazwisko: </label>
                <p>
                  {props.follower.lastName}
                </p>
              </Col>
            </Row>

            <Row type="flex" justify="space-around" align="middle">
              <Col span={10}>
                <Card title="Blogi" style={{backgroundColor: '#989FCE'}}>
                  {props.blogs &&
                    props.blogs.map(blog =>
                      <p key={blog._id}>
                        {blog.name}
                      </p>
                    )}
                </Card>
              </Col>
              <Col span={10}>
                <Card title="Obserwowani użytkownicy" style={{backgroundColor: '#989FCE'}}>
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
  const { user, follower, error, loading, following, blogs } = state.user;
  return { user, error, follower, loading, following, blogs };
}

const actionCreators = {
  getFollowing: userActions.getFollowing,
  getFollowerById: userActions.getFollowerById,
  getUserById: userActions.getUserById,
  getBlogs: userActions.getBlogs,
  unFollow: userActions.unFollow,
  follow: userActions.follow,
  logout: userActions.logout
};

export default connect(mapState, actionCreators)(
  withRouter(SearchUserAccountPage)
);
