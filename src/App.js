import NewsTable from "./pages/MainPage";
import NewsItem from "./pages/NewsPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

function App() {
  return (
    <Router forceRefresh={true}>
      <div>
        <Switch>
          <Route exact path='/news/:id'>
            <NewsItem />
          </Route>
          <Route exact path='/'>
            <NewsTable />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
