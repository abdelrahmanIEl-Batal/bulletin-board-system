import React, { useState } from "react";

import "./App.css";
import { Nav } from "./components/Nav";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { createRootStore } from "./stores/RootStore";
import { observer } from "mobx-react-lite";
import { Profile } from "./components/Profile";
import { BoardDetails } from "./components/BoardDetails";
import { ThreadDetails } from "./components/ThreadDetails";

require("dotenv").config();

const App: React.FC = observer(() => {
  const [rootStore] = useState(() => createRootStore());

  return (
    <Router>
      <Nav rootStore={rootStore} />;
      <Switch>
        <Route exact path="/">
          <Home rootStore={rootStore} />
        </Route>
        <Route path="/login">
          <Login rootStore={rootStore} />
        </Route>
        <Route path="/register">
          <Register rootStore={rootStore} />
        </Route>
        <Route path="/profile/:id">
          <Profile rootStore={rootStore} />
        </Route>
        <Route path="/board/:id">
          <BoardDetails rootStore={rootStore} />
        </Route>
        <Route path="/thread/:id">
          <ThreadDetails rootStore={rootStore} />
        </Route>
      </Switch>
    </Router>
  );
});

export default App;
