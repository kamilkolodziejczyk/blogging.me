import React from 'react';
import {
  Upload,
  Icon,
  message,
  Button,
  Tooltip,
  Col,
  Form,
  Avatar,
  Row
} from 'antd';
import Cropper from 'react-cropper';

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

class ImageUploader extends React.Component {
  state = {
    loading: false,
    croppingImg: ''
  };
  _crop() {
    this.setState({
      croppingImg: this.refs.cropper.getCroppedCanvas().toDataURL()
    });
    this.props.setAvatarImg(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        this.props.changeImageUrl(imageUrl);
        this.setState({
          loading: false
        });
      });
    }
  };
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>Upload</div>
      </div>
    );
    const FormItem = Form.Item;
    const { imageUrl } = this.props;
    return (
      <Row align='middle' type='flex' justify='space-between'>
        <Col span={12}>
          <FormItem>
            <h2>
              <Avatar
                style={{ marginRight: 10 }}
                size={64}
                src={
                  this.state.croppingImg === ''
                    ? this.props.avatarImg
                    : this.state.croppingImg
                }
              />
              {`${this.props.firstName} ${this.props.lastName}`}
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
                onChange={this.handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt='avatar' /> : uploadButton}
              </Upload>
            )}
            {imageUrl && (
              <div>
                <Cropper
                  ref='cropper'
                  src={this.props.imageUrl}
                  style={{ height: 100, width: 100 }}
                  // Cropper.js options
                  aspectRatio={12 / 12}
                  guides={false}
                  cropBoxResizable={false}
                  minCropBoxWidth={50}
                  crop={this._crop.bind(this)}
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
    );
  }
}

export default ImageUploader;
