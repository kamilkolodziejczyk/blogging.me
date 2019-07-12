import React, { Component } from 'react';
import { Upload, Icon, message, Form, Input } from 'antd';
import Cropper from 'react-cropper';
import { Button } from 'antd/lib/radio';
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
    blogs: [],
    following: []
  };

  componentDidMount() {
    axios
      .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res =>
        this.setState({
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName
        })
      )
      .catch(err => console.log(err));
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
    console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

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
      <div>
        <Form>
          <FormItem>
            <Input
              type='text'
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Input
              type='text'
              value={this.state.firstName}
              onChange={e => this.setState({ firstName: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <Input
              type='text'
              value={this.state.lastName}
              onChange={e => this.setState({ lastName: e.target.value })}
            />
          </FormItem>
          <FormItem>
            <ul>
              {this.state.blogs.map(blog => (
                <li key={blog._id}>
                  {blog.name}{' '}
                  <Button type='danger' shape='circle' icon='minus' />
                </li>
              ))}
            </ul>
          </FormItem>
          <FormItem>
            <ul>
              {this.state.following.map(follow => (
                <li key={follow._id}>
                  {follow.firstName} {follow.lastName}{' '}
                  <Button type='danger'>Unfollow</Button>
                </li>
              ))}
            </ul>
          </FormItem>
        </Form>

        {/* {!this.state.imageUrl && (
          <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt='avatar' /> : uploadButton}
          </Upload>
        )}
        {this.state.imageUrl && (
          <Cropper
            ref='cropper'
            src={this.state.imageUrl}
            style={{ height: 100, width: 100 }}
            // Cropper.js options
            aspectRatio={16 / 12}
            guides={false}
            cropBoxResizable={false}
            minCropBoxWidth={50}
            crop={this._crop.bind(this)}
          />
        )} */}
      </div>
    );
  }
}

export default AccountPage;
