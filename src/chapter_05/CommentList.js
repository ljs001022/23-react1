import React from 'react';
import Comment from './Comment.jsx';

const comments = [
  {
    name : "이지원1",
    comment : "안녕하세요 이지원1입니다."
  },
  {
    name : "이지원2",
    comment : "안녕하세요 이지원2입니다."
  },
  {
    name : "이지원3",
    comment : "안녕하세요 이지원3입니다."
  }
]

const CommentList = () => {
  return (
    <div>
      {comments.map((foo) => {
        return(
          <Comment name={foo.name} comment={foo.comment} />
        )
      })}
    </div>
  );
};

export default CommentList;