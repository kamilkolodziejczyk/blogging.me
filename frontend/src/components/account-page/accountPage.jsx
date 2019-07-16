import React, { Component } from 'react';
import {
  Upload,
  Icon,
  message,
  Form,
  Input,
  Button,
  Avatar,
  Row,
  Col,
  notification
} from 'antd';
import Cropper from 'react-cropper';
import axios from 'axios';
import Api from '../../endpoints';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class AccountPage extends Component {
  state = {
    loading: false,
    email: '',
    firstName: '',
    lastName: '',
    avatarImg: '',
    following: [],
    croppingImg: ''
  };

  componentDidMount() {
    axios
      .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        this.setState({
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          avatarImg: res.data.avatar ? res.data.avatar : ''
        });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
    axios
      .get(`${Api.USER_FOLLOWERS}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => this.setState({ following: res.data }))
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };
  _crop() {
    // image in dataUrl
    this.setState({
      croppingImg: this.refs.cropper.getCroppedCanvas().toDataURL(),
      avatarImg: this.refs.cropper.getCroppedCanvas().toDataURL()
    });
  }
  deleteBlog = blogId => {
    axios
      .delete(`${Api.BLOG}/${blogId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        notification['success']({
          message: 'The blog was successfully deleted'
        });
        this.props.updateBlogs();
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  };
  unfollowUser = userId => {
    axios
      .put(
        `${Api.USER_UNFOLLOW}/${localStorage.getItem('user_id')}`,
        { follower: userId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      )
      .then(res => {
        notification['success']({
          message: 'This user was successfully unfollow'
        });
        this.setState({ following: res.data.following });
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  };
  saveUser = () => {
    axios
      .put(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        avatar: this.state.avatarImg
      })
      .then(() => {
        notification['success']({
          message: 'Successfully edit'
        });
        this.setState({ imageUrl: '' });
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>Upload</div>
      </div>
    );
    const FormItem = Form.Item;
    const { imageUrl } = this.state;
    return (
      <div className='account-wrapper'>
        <Form>
          <Row align='middle' type='flex' justify='space-between'>
            <Col span={12}>
              <FormItem>
                <h2>
                  <Avatar
                    style={{ marginRight: 10 }}
                    size={64}
                    src={
                      this.state.croppingImg === ''
                        ? this.state.avatarImg
                        : this.state.croppingImg
                    }
                  />
                  {`${this.state.firstName} ${this.state.lastName}`}
                </h2>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <label>Change your avatar: </label>
                {!this.state.imageUrl && (
                  <Upload
                    name='avatar'
                    listType='picture-card'
                    className='avatar-uploader'
                    showUploadList={false}
                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt='avatar' />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
                {this.state.imageUrl && (
                  <Cropper
                    ref='cropper'
                    src={this.state.imageUrl}
                    style={{ height: 100, width: 100 }}
                    // Cropper.js options
                    aspectRatio={12 / 12}
                    guides={false}
                    cropBoxResizable={false}
                    minCropBoxWidth={50}
                    crop={this._crop.bind(this)}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row align='middle' type='flex' justify='space-between' gutter={32}>
            <Col span={8}>
              <FormItem>
                <label>Your email:</label>
                <Input
                  size='large'
                  type='text'
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              {' '}
              <FormItem>
                <label>Your first name:</label>
                <Input
                  size='large'
                  type='text'
                  value={this.state.firstName}
                  onChange={e => this.setState({ firstName: e.target.value })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              {' '}
              <FormItem>
                <label>Your last name:</label>
                <Input
                  size='large'
                  type='text'
                  value={this.state.lastName}
                  onChange={e => this.setState({ lastName: e.target.value })}
                />
              </FormItem>
            </Col>
          </Row>
          <Row align='middle' type='flex' justify='end'>
            <Col>
              <Button type='primary' onClick={this.saveUser}>
                Save
              </Button>
            </Col>
          </Row>

          <Row align='middle' type='flex' justify='space-between'>
            <Col span={12}>
              {' '}
              <FormItem>
                <label>Your blogs:</label>
                <ul className='list'>
                  {this.props.blogs.map(blog => (
                    <li key={blog._id}>
                      {blog.name}{' '}
                      <Button
                        type='danger'
                        shape='circle'
                        icon='minus'
                        onClick={() => this.deleteBlog(blog._id)}
                      />
                    </li>
                  ))}
                </ul>
              </FormItem>
            </Col>
            <Col span={12}>
              {' '}
              <FormItem>
                <label>Following:</label>
                <ul className='list'>
                  {this.state.following.map(follow => (
                    <li key={follow._id}>
                      {follow.firstName} {follow.lastName}{' '}
                      <Button
                        onClick={() => this.unfollowUser(follow._id)}
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
        </Form>
      </div>
    );
  }
}

export default AccountPage;
