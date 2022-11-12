import { Comment } from "semantic-ui-react";
import { fetchKidsComments } from "../store/newsSlice";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import images from "../assets/images/animal_cat_circle_domestic_pet_icon.png";
import "../assets/styles/newsComments.css";

const NewsСomment = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!props.kids) {
      return;
    }
    const obj = { parentId: props.id, kidsIds: props.kids };
    setIsVisible(!isVisible);
    dispatch(fetchKidsComments(obj));
  };

  const dataCommentsKids = useSelector((state) => state.news.nestedComments);

  const nestedCommentsObj = dataCommentsKids.find(
    (kidsObj) => kidsObj.parentId === props.id
  );

  let nestedComments;

  if (nestedCommentsObj) {
    nestedComments = nestedCommentsObj.kids.map((kid) => {
      return (
        <NewsСomment
          key={kid.id}
          id={kid.id}
          by={kid.by}
          time={new Intl.DateTimeFormat("ru-RU").format(kid.time * 1000)}
          text={kid.text}
          kids={kid.kids}
        />
      );
    });
  }

  return (
    <div className='comments__innerContainer'>
      <Comment onClick={handleClick} className='comments__first'>
        <Comment.Avatar src={images} />
        <Comment.Content>
          <Comment.Author as='a'>{props.by}</Comment.Author>
          <Comment.Metadata>
            <div>{props.time}</div>
          </Comment.Metadata>
          <Comment.Text>{props.text}</Comment.Text>
        </Comment.Content>
      </Comment>
      <div className='comments__nested'>
        {props.kids && <p>+</p>}
        {isVisible ? (
          dataCommentsKids && dataCommentsKids.length > 0 && nestedComments
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NewsСomment;
