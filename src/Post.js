import React, { useState, useEffect } from 'react';
import './Post.css';
import firebase from 'firebase';
import { db } from './firebase';
import Avatar from "@material-ui/core/Avatar";
import ProfilePic from "../src/resources/images/icon.png"

function Post({ postId, user, username, description, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');

    }

    //Everytime we add a variable in a useEffect we need to add it as a dependency
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    return (
        <div className="post">
            <div className="post__header">

                <Avatar className="post__avatar"
                    alt={username}
                    src={ProfilePic}
                />
                <h3>{username}</h3>
            </div>

            <img className="post__image" alt='' src={imageUrl}></img>
            <h4 className="post__text"><strong>{username}: </strong> {description}</h4>

            <div className="post__comments">
                <h5 className="post__commentsTitle">
                    Comments ({comments.length})
                </h5>
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}:</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}>
                        Comment
                    </button>
                </form>
            )}

        </div>
    )
}

export default Post
