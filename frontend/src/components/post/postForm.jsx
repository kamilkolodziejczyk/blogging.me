import React, { Component } from 'react';
import {
  Form,
  Button,
  Input,
  Tooltip,
  Select,
  notification,
  Modal,
  Upload,
  Icon,
  message
} from 'antd';
import axios from 'axios';
import Api from '../../endpoints';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;

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

class PostForm extends Component {
  state = {
    title: '',
    content: '',
    currentBlog: '',
    isCreatePostDisable: true,
    blogs: [],
    visible: false,
    loading: false
  };

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
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      title: '',
      content: '',
      currentBlog: '',
      imageUrl: ''
    });
  };
  componentDidMount() {
    axios
      .get(`${Api.BLOG}/${localStorage.getItem('user_id')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        this.setState({ blogs: res.data.blogs });
        if (res.data.token) localStorage.setItem('token', res.data.token);
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  }
  createPost = () => {
    axios
      .post(
        `${Api.POST}/${this.state.currentBlog}`,
        {
          post: {
            title: this.state.title,
            content: this.state.content,
            publishDate: Date.now(),
            image: this.state.imageUrl
          }
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      )
      .then(res => {
        notification['success']({
          message: 'Successfull create post'
        });
        this.setState({
          title: '',
          content: '',
          currentBlog: '',
          imageUrl: '',
          visible: !this.state.visible
        });
      })
      .catch(err => {
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
    const { imageUrl } = this.state;
    return (
      <React.Fragment>
        <Button
          className='create-post-button'
          type='primary'
          onClick={this.showModal}
        >
          <Icon type='plus' />
          Create a new post
        </Button>
        <Modal
          title='Create a post'
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key='back' onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key='create'
              disabled={this.state.isCreatePostDisable}
              type='primary'
              onClick={this.createPost}
            >
              Create post
            </Button>
          ]}
        >
          <div className='create-post-wrapper'>
            <Form className='create-post-form'>
              <Select defaultValue='Choose blog'>
                {this.state.blogs &&
                  this.state.blogs.map(blog => (
                    <Option
                      key={blog._id}
                      onClick={e =>
                        this.setState({
                          currentBlog: e.key,
                          isCreatePostDisable: !this.state.isCreatePostDisable
                        })
                      }
                    >
                      {blog.name}
                    </Option>
                  ))}
              </Select>
              <FormItem>
                <Input
                  value={this.state.title}
                  onChange={e => this.setState({ title: e.target.value })}
                  placeholder='Post title '
                />
              </FormItem>
              <FormItem>
                <TextArea
                  placeholder='Post content'
                  value={this.state.content}
                  onChange={e => this.setState({ content: e.target.value })}
                />
              </FormItem>
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
                  <img width={200} height={200} src={imageUrl} alt='avatar' />
                ) : (
                  uploadButton
                )}
              </Upload>
              <Tooltip
                className='tooltip'
                title='To create a post you have to choose a blog from the dropdown.'
              >
                <Button type='danger' shape='circle' icon='question' />
              </Tooltip>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default PostForm;
