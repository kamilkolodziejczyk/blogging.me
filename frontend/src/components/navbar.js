import React, {useState, useEffect} from 'react';
import {Menu, Icon, AutoComplete, Button} from 'antd';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import debounce from 'lodash.debounce';
import axios from 'axios';
import endpoints from '../endpoints';
import {userActions} from '../redux/actions';

const Navbar = props => {
  const [current, setCurrent] = useState('/home');
  const [searchUser, setSearchUser] = useState('');
  const [users, setUsers] = useState([]);

  const handleMenuClick = e => {
    setCurrent(e.key);
  };

  const searchDebounceFunction = debounce(() => {
    if (searchUser) getSearchUser();
  }, 1000);

  const getSearchUser = () => {
    axios
      .get(`${endpoints.USER_SEARCH}/${localStorage.getItem('user_id')}`, {
        headers: {'x-auth-token': localStorage.getItem('token')}
      })
      .then(res => setUsers(res.data))
      .catch(error => {
        if (error.response.status === 401) {
          props.logout();
        }
      });
  };
  const selectUser = e => {
    props.history.push(`/account/${e.key}`);
  };

  useEffect(
    () => {
      setCurrent(props.location.pathname);
    },
    [props.location.pathname]
  );

  const MenuItem = Menu.Item;
  const options = users.map(user =>
    <AutoComplete.Option
      onClick={e => {
        setSearchUser('');
        selectUser(e);
      }}
      key={user._id}
      value={user._id}
    >
      {`${user.firstName} ${user.lastName}`}
    </AutoComplete.Option>
  );
  return (
    <Menu className='navbar' mode="horizontal" onClick={handleMenuClick} selectedKeys={[current]}>
      <MenuItem key="/home">
        <Button type='primary'>
          <Link to="/home">
            <Icon type="home"/>
            Strona główna
          </Link>
        </Button>
      </MenuItem>
      <MenuItem key="/me">
        <Button type='primary'>
          <Link to="/me">
            <Icon type="setting"/>
            Twoje konto {localStorage.getItem('user_firstname')}
          </Link>
        </Button>
      </MenuItem>
      <MenuItem key="/add-new-blog">
        <Button type='primary'>
          <Link to="/add-new-blog">
            <Icon type="plus"/>
            Utwórz blog
          </Link>
        </Button>
      </MenuItem>
      <MenuItem key="logout">
        <Button type='danger'>
          <Link
            to="/"
            onClick={() => {
              props.changeVisible(false);
              props.logout();
            }}
          >
            <Icon type="logout"/>
            Wyloguj się
          </Link>
        </Button>
      </MenuItem>
      <AutoComplete
        size="large"
        value={searchUser}
        dataSource={options}
        filterOption={(inputValue, option) =>
          option.props.children
            .toUpperCase()
            .indexOf(inputValue.toUpperCase()) !== -1}
        placeholder="Szukaj użytkownika..."
        onChange={e => {
          setSearchUser(e);
          searchDebounceFunction();
        }}
        onFocus={getSearchUser}
      />
    </Menu>
  );
};

function mapState(state) {
  const {user} = state.user;
  return {user};
}

const actionCreators = {
  logout: userActions.logout
};

export default connect(mapState, actionCreators)(withRouter(Navbar));
