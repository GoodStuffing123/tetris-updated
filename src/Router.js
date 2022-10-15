import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./pages/App";
import Play from "./pages/Play";
import Lost from "./pages/Lost";

import NotFound from "./pages/NotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/play" element={<Play />} />
        <Route exact path="/lost" element={<Lost />} />

        <Route render={() => <NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
