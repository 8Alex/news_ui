import { Header, Container, Divider, List } from "semantic-ui-react";
import NewsСomments from "../components/Comments";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchItem, fetchComments } from "../store/newsSlice";
import { useEffect } from "react";
import "../assets/styles/newsPage.css";

const NewsItem = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchItem(props.match.params.id));
  }, [dispatch, props.match.params.id]);

  const data = useSelector((state) => state.news.currentNews);

  useEffect(() => {
    if (data) {
      if (data.kids) {
        dispatch(fetchComments(data.kids));
      }
    }
  }, [dispatch, data]);

  const handleClick = () => {
    props.history.push("/");
  };

  const handleReloadComments = () => {
    dispatch(fetchComments(data.kids));
  };

  if (data) {
    return (
      <div className='item__container'>
        <Header as='h1' className='item__title'>
          {data.title}
        </Header>
        <Container textAlign='left'>
          <List>
            <List.Item>
              <List.Icon className='item__icon' name='users' />
              <List.Content>{data.by}</List.Content>
            </List.Item>
            <List.Item>
              <List.Icon className='item__icon' name='calendar' />
              <List.Content>
                {new Intl.DateTimeFormat("ru-RU").format(data.time * 1000)}
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon className='item__icon' name='linkify' />
              <List.Content>
                <a href={data.url}>Ссылка на новость</a>
              </List.Content>
            </List.Item>
          </List>
          <Divider />
          <button onClick={handleClick} className='item__btn'>
            Вернуться к списку новостей
          </button>
          <NewsСomments
            counter={data.descendants}
            onReload={handleReloadComments}
            kids={data.kids}
          />
        </Container>
      </div>
    );
  }
};

export default withRouter(NewsItem);
