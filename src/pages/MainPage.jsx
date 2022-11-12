import { Table, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchNews } from "../store/newsSlice";

const NewsTable = (props) => {
  const { status, error } = useSelector((state) => state.news);
  const dispatch = useDispatch();

  const data = useSelector((state) => state.news.news);

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchNews());
    } else {
      const time = setTimeout(() => {
        dispatch(fetchNews());
      }, 60000);
      return () => {
        clearTimeout(time);
      };
    }
  }, [dispatch, data]);

  const handleClick = (id) => {
    props.history.push(`/news/${id}`);
  };

  const handleReloadNews = () => {
    dispatch(fetchNews());
  };

  return (
    <div>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Название</Table.HeaderCell>
            <Table.HeaderCell>Рейтинг</Table.HeaderCell>
            <Table.HeaderCell>Ник автора</Table.HeaderCell>
            <Table.HeaderCell>Дата публикации</Table.HeaderCell>
            <Table.HeaderCell>
              <Icon fitted name='refresh' onClick={handleReloadNews} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {status === "loading" && (
            <Table.Row>
              <Table.Cell>
                <h2>Loading...</h2>
              </Table.Cell>
            </Table.Row>
          )}
          {error && (
            <Table.Row>
              <Table.Cell>
                <h2>Error:{error}</h2>
              </Table.Cell>
            </Table.Row>
          )}
          {data.map((item, index) => (
            <Table.Row onClick={() => handleClick(item.id)} key={item.id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{item.title}</Table.Cell>
              <Table.Cell>{item.score}</Table.Cell>
              <Table.Cell>{item.by}</Table.Cell>
              <Table.Cell>
                {new Intl.DateTimeFormat("ru-RU").format(item.time * 1000)}
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default withRouter(NewsTable);
