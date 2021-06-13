import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./pages/App";
import Play from "./pages/Play";
import Lost from "./pages/Lost";

import NotFound from "./pages/NotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <App />} />
        <Route exact path="/play" render={() => <Play />} />
        <Route exact path="/lost" render={() => <Lost />} />

        <Route render={() => <NotFound />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
