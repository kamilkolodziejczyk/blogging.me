import React, {useState} from "react";
import {Avatar, Button, Comment, Form, List} from "antd";
import TextArea from "antd/es/input/TextArea";
import {commentActions, postActions} from "../../redux/actions";
import {connect} from "react-redux";
import moment from "moment";

const CommentList = (props) => {
  const comments = [];
  props.comments.map(c => {
    comments.push({
      author: `${c.author.firstName} ${c.author.lastName}`,
      avatar: (<Avatar
      src={c.author.avatar ? c.author.avatar : ''}
      icon={c.author.avatar ? '' : 'user'}
    />),
      content: c.content,
      datetime: moment().from(c.date)
    })
  });

  return <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'odpowiedzi' : 'odpowiedź'}`}
    itemLayout='horizontal'
    renderItem={props => <Comment {...props} />}
  />
};

const Editor = ({onChange, onClick, value}) => (
  <div>
    <Form.Item>
      <TextArea
        rows={2}
        onChange={onChange}
        placeholder='Napisz...'
        value={value}
      />
    </Form.Item>
    <Form.Item>
      <Button onClick={onClick} type='primary'>
        Dodaj komentarz
      </Button>
    </Form.Item>
  </div>
)


const Comments = (props) => {

  const [value, setValue] = useState('');

  const handleSubmit = () => {
    props.create(props.postId, localStorage.getItem('user_id'), value, Date.now());
    setValue('');
    props.getAllFollowersPosts(localStorage.getItem('user_id'));
  };

  return <React.Fragment>
    {props.comments.length > 0 && <CommentList comments={props.comments}/>}
    <Comment
      avatar={
        <Avatar
          src={props.user.avatar ? props.user.avatar : ''}
          icon={props.user.avatar ? '' : 'user'}
        />
      }
      content={
        <Editor
          onChange={e => setValue(e.target.value)}
          onClick={handleSubmit}
          value={value}
        />
      }
    />
  </React.Fragment>
};


function mapState(state) {
  const {loading, error} = state.comment;
  return {loading, error};
}

const actionCreators = {
  create: commentActions.create,
  getAllFollowersPosts: postActions.getAllFollowersPosts
};

export default connect(mapState, actionCreators)(Comments);

