import React, { useState, useEffect } from 'react';
import './Comment.css'; 
import { Link } from 'react-router-dom';

function Comment() {
    const [comments, setComments] = useState(() => {
        const savedComments = localStorage.getItem('comments');
        return savedComments ? JSON.parse(savedComments) : [];
    });
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments));
    }, [comments]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    const handleClearLocalStorage = () => {
        localStorage.clear();
        setComments([]);
    };

    return (
        <div>
            <div className="background-image"></div>
            <div className="overlay-c">
                <Link to="/"><h1 className="title-image">Motivdle</h1></Link>
                <Link to="/"><p className="subtitle-image">Inspire. Empower. Achieve.</p></Link>

                <div className="comment-section">
                    <h2>Leave a Comment</h2>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Write your comment here"
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                    <div className="comments-list">
                        {comments.map((comment, index) => (
                            <div key={index} className="comment">
                                {comment}
                            </div>
                        ))}
                    </div>
                    <button className="clear-button" onClick={handleClearLocalStorage}>Clear Comments</button>
                </div>
            </div>
        </div>
    );
}

export default Comment;
