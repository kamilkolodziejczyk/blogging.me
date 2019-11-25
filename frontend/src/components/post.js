import React, {useEffect, useState} from 'react';
import {Avatar} from "antd";
import {Emoji} from "emoji-mart";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {reactionActions} from "../redux/actions";

const Post = props => {

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    props.getAllReactions(props.post.reactions)
  }, []);

  useEffect(() => {
    if (props.reaction) {
      setLikes(props.reaction.likes);
      setDislikes(props.reaction.dislikes)
    }

  }, [props.reaction]);

  return <div className='post-wrapper'>
    <header className='post-header'>
      <Link to={props.author._id === localStorage.getItem('user_id') ? '/me' : `/account/${props.author._id}`}>
        <Avatar src={props.author.avatar}/>
        <span className='post-author'>{`${props.author.firstName} ${
          props.author.lastName
        }`}</span>
      </Link>
    </header>
    <main className='post-main'>
      <h3>{props.post.title}</h3>
      <div className='content'>{props.post.content}</div>
      {props.post.image && (
        <img
          className='img'
          width='200'
          height='200'
          src={props.post.image}
          alt={props.post._id}
        />
      )}
    </main>
    <footer className='post-footer'>
      <div
        className='clickable'
        onClick={(e) => handleClick('like', e)}
      >
        <Emoji emoji={{id: props.customization.likeButton}} size={16}/>
        <span>{likes.length}</span>
      </div>
      <div
        className='clickable'
        onClick={(e) => handleClick('dislike', e)}
      >
        <Emoji emoji={{id: props.customization.dislikeButton}} size={16}/>
        <span>{dislikes.length}</span>
      </div>
    </footer>
  </div>

};

function mapState(state) {
  const {reaction, loading, error} = state.reaction;
  return {reaction, loading, error};
}

const actionCreators = {
  getAllReactions: reactionActions.getAllReactions
};

export default connect(mapState, actionCreators)(withRouter(Post));
