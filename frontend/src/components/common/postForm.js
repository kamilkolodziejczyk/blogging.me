import React, {useEffect, useState} from 'react';
import {Button, Form, Icon, Input, message, Modal, Select, Tooltip, Upload} from 'antd';
import {userActions} from './../../redux/actions/user.actions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {postActions} from './../../redux/actions/post.actions';

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

const CreatePostForm = props => {
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentBlog, setCurrentBlog] = useState('');
  const [isCreatePostDisable, setIsCreatePostDisable] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const {Option} = Select;

  useEffect(() => {
    props.getBlogs(localStorage.getItem('user_id'));
  }, []);

  useEffect(
    () => {
      setSpinning(props.loading);
      if (props.blogs) {
        setBlogs(props.blogs);
      }
      if (props.error) {
        props.history.push('/');
        props.logout();
      }
    },
    [props.blogs, props.error, props.loading]
  );

  const handleOk = () => {
    props.create(currentBlog, {
      title,
      content,
      image: imageUrl,
      publishDate: Date.now()
    });
    props.getAllFollowersPosts(localStorage.getItem('user_id'));
    setVisible(false);
    setTitle('');
    setContent('');
    setCurrentBlog('');
    setIsCreatePostDisable(false);
    setImageUrl('');
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'}/>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        <Icon type="plus"/>
        Create new post
      </Button>
      <Modal
        title="Create Post"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={isCreatePostDisable}
            loading={spinning}
            onClick={handleOk}
          >
            Add post
          </Button>
        ]}
      >
        <Form>
          <Form.Item>
            <Select defaultValue="Choose blog">
              {blogs.length > 0 &&
              blogs.map(blog =>
                <Option
                  key={blog._id}
                  onClick={e => {
                    setCurrentBlog(e.key);
                    setIsCreatePostDisable(false);
                  }}
                >
                  {blog.name}
                </Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
            />
          </Form.Item>
          <Form.Item>
            <Input
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Content"
            />
          </Form.Item>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl
              ? <img width={200} height={200} src={imageUrl} alt="avatar"/>
              : uploadButton}
          </Upload>
          <Tooltip
            className="tooltip"
            title="To create a post you have to choose a blog from the dropdown."
          >
            <Button type="danger" shape="circle" icon="question"/>
          </Tooltip>
        </Form>
      </Modal>
    </div>
  );
};

function mapState(state) {
  const {error, loading, blogs} = state.user;
  const {error: postError, loading: postLoading, posts} = state.post;
  return {error, loading, blogs, postError, postLoading, posts};
}

const actionCreators = {
  getBlogs: userActions.getBlogs,
  getAllFollowersPosts: postActions.getAllFollowersPosts,
  logout: userActions.logout,
  create: postActions.create
};

export default connect(mapState, actionCreators)(withRouter(CreatePostForm));
