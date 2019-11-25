import React, {useEffect, useState} from 'react';
import {Avatar} from "antd";
import {Emoji} from "emoji-mart";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {reactionActions} from "../redux/actions";

const Post = props => {

    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [isCanLike, setIsCanLike] = useState(false);
    const [isCanDislike, setIsCanDislike] = useState(false);


    useEffect(() => {
        props.getAllReactions(props.post.reactions)
    }, []);

    useEffect(() => {
        if (props.reaction) {
            setLikes(props.reaction.likes);
            setDislikes(props.reaction.dislikes);
            setIsCanLike(likes.length > 0 ? likes.some(l => l !== localStorage.getItem("user_id")) : true);
            setIsCanDislike(dislikes.length > 0 ? dislikes.some(d => d !== localStorage.getItem("user_id")) : true);
        }
    }, [props.reaction]);

    const handleLikeClick = e => {
        likes.push(localStorage.getItem('user_id'));
        setDislikes(dislikes.filter(d => d !== localStorage.getItem('user_id')));
        setIsCanLike(false);
        setIsCanDislike(true);
        //todo redux - like
    };

    const handleDislikeClick = e => {
        dislikes.push(localStorage.getItem('user_id'));
        setLikes(likes.filter(l => l !== localStorage.getItem('user_id')));
        setIsCanLike(true);
        setIsCanDislike(false);
        //todo redux - dislike
    };
    console.log(props)
    return <div className='post-wrapper'>
        <header className='post-header'>
            <Link
                to={props.author._id === localStorage.getItem('user_id') ? '/me' : `/account/${props.author._id}`}>
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
                className={isCanLike ? 'clickable' : ''}
                onClick={isCanLike ? (e) => handleLikeClick(e) : null}
            >
                <Emoji emoji={{id: props.customization.likeButton}} size={16}/>
                <span>{likes.length}</span>
            </div>
            <div
                className={isCanDislike ? 'clickable' : ''}
                onClick={isCanDislike ? (e) => handleDislikeClick(e) : null}
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
