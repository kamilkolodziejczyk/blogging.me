import React, { useState, useEffect } from 'react';
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
  notification,
  Spin,
  Tooltip
} from 'antd';
import { withRouter } from 'react-router-dom';
import Cropper from 'react-cropper';
import axios from 'axios';
import endpoints from '../../../endpoints';

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

const CurrentUserAccountPage = props => {
  const FormItem = Form.Item;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [avatarImg, setAvatarImg] = useState('');
  const [following, setFollowing] = useState([]);
  const [croppingImg, setCroppingImg] = useState('');
  const [spinning, setSpinning] = useState(false);

  const handleChange = () => {};
  const _crop = () => {};
  const saveUser = () => {};
  const deleteBlog = () => {};
  const unfollowUser = () => {};

  useEffect(() => {
    setSpinning(true);
    axios
      .get(`${endpoints.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        setEmail(res.data.email);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setAvatarImg(res.data.avatar ? res.data.avatar : '');
      })
      .catch(err => {
        setSpinning(false);
        if (err.response.status === 401) {
          props.logout();
        }
      });
    axios
      .get(`${endpoints.USER_FOLLOWERS}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        setFollowing(res.data);
        setSpinning(false);
      })
      .catch(err => {
        setSpinning(false);

        // if (err.response.status === 401) {
        //   props.logout();
        // }
      });
  }, []);

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className='ant-upload-text'>Upload</div>
    </div>
  );
  return (
    <div className='account-wrapper'>
      <Form>
        <Spin spinning={spinning} size='large'>
          <Row align='middle' type='flex' justify='space-between'>
            <Col span={12}>
              <FormItem>
                <h2>
                  <Avatar
                    style={{ marginRight: 10 }}
                    size={64}
                    src={croppingImg === '' ? avatarImg : croppingImg}
                  />
                  {`${firstName} ${lastName}`}
                </h2>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <label>Change your avatar: </label>
                {!imageUrl && (
                  <Upload
                    name='avatar'
                    listType='picture-card'
                    className='avatar-uploader'
                    showUploadList={false}
                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt='avatar' />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
                {imageUrl && (
                  <div>
                    <Cropper
                      ref='cropper'
                      src={imageUrl}
                      style={{ height: 100, width: 100 }}
                      // Cropper.js options
                      aspectRatio={12 / 12}
                      guides={false}
                      cropBoxResizable={false}
                      minCropBoxWidth={50}
                      crop={_crop.bind(this)}
                    />
                    <Tooltip
                      className='tooltip'
                      title='Remember, photo must be smaller than 2MB'
                    >
                      <Button type='danger' shape='circle' icon='question' />
                    </Tooltip>
                  </div>
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

export default withRouter(CurrentUserAccountPage);
