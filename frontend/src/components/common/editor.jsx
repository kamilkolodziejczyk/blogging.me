import React from 'react';
import { Form, Button, Input } from 'antd';

const { TextArea } = Input;

const Editor = ({ onChange, onClick, value }) => (
  <div>
    <Form.Item>
      <TextArea
        rows={2}
        onChange={onChange}
        value={value}
        placeholder='Type something...'
      />
    </Form.Item>
    <Form.Item>
      <Button onClick={onClick} type='primary'>
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

export default Editor;
