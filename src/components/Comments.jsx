import { Comment, Header, Icon } from "semantic-ui-react";
import "../assets/styles/newsComments.css";
import { useSelector } from "react-redux";
import NewsСomment from "./Comment";

const NewsСomments = (props) => {
  const dataComments = useSelector((state) => state.news.comments);
  const { status, error } = useSelector((state) => state.news);

  const handleCommentReload = () => {
    if (props.kids) {
      props.onReload();
    }
  };

  return (
    <Comment.Group className='comments__container'>
      <Header as='h3' dividing>
        Комментарии
        <span className='comments__count'>{props.counter}</span>
        <span className='comments__icon'>
          <Icon fitted name='refresh' onClick={handleCommentReload} />
        </span>
      </Header>
      {status === "loading" && <h3>Loading...</h3>}
      {error && <h3>Error:{error}</h3>}
      {dataComments &&
        dataComments.length > 0 &&
        dataComments.map((comment) => (
          <NewsСomment
            key={comment.id}
            id={comment.id}
            by={comment.by}
            time={new Intl.DateTimeFormat("ru-RU").format(comment.time * 1000)}
            text={comment.text}
            kids={comment.kids}
          />
        ))}
    </Comment.Group>
  );
};

export default NewsСomments;
