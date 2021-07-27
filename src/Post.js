import React, { useState, useEffect } from 'react';


import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import firebase from 'firebase';
import './Post.css';
import { db } from './firebase';
import { Button } from '@material-ui/core';


function Post(props) {
    const { postId, user, username, imageUrl, caption } = props;
    let likes = props.likes;
    let like = props.like;
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    const likeText = likes.length !== 0 ? `${likes.length} kişi bunu beğendi` : ``;

    useEffect(() => {

        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                });

        }
        return () => {
            unsubscribe();
        };
    }, [postId])

    const handleChange = (e) => {
        e.preventDefault();
        like = !like;
        if(user===null){
        alert("Sign in")
        }
        else if (like) {
            likes.push(user.displayName)

        } else if (likes.includes(user.displayName)) {
            likes = likes.filter(item => item !== user.displayName)

        }
        db.collection("posts").doc(postId).update({
            likes: [...likes]
        });

    }
    const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('')
    }
    return (
        <div className="post">
            {/*header->avatar+username*/}
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>

            </div>

            <img className="post__image" src={imageUrl} alt="..." />
            {/*image*/}
            <div className="like__container">
                <FormControlLabel
                    control={<Checkbox checked={like} icon={<FavoriteBorder />} onChange={handleChange} checkedIcon={<Favorite />} name="checkedH" />}
                />
                <span>{likeText}</span>
            </div>
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>
            {/*username+caption*/}


            <div className="post__comments">{
                comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))
            }</div>

            {user && (
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="Add a comment..."
                        value={comment} onChange={(e) => setComment(e.target.value)} />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >Post</button>
                </form>
            )}




        </div>
    )
}

export default Post
