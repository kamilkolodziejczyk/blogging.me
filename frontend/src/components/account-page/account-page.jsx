import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
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

class AccountPage extends Component {
  state = {
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
    const { imageUrl } = this.state;
    return (
      <div>
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
            {imageUrl ? <img src={imageUrl} alt='avatar' /> : uploadButton}
          </Upload>
        )}
        {this.state.imageUrl && (
          <Cropper
            ref='cropper'
            src={this.state.imageUrl}
            style={{ height: 400, width: 400 }}
            // Cropper.js options
            aspectRatio={16 / 12}
            guides={false}
            cropBoxResizable={false}
            minCropBoxWidth={400}
            crop={this._crop.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default AccountPage;
