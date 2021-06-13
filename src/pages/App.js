import React from "react";

const App = () => {
  const play = () => {
    window.location.href = "/play";
  };

  return (
    <>
      <h1 className="intro-text">
        Tetris <span>Updated</span>
      </h1>

      <button className="play-button" onClick={play}>
        Play
      </button>
    </>
  );
};

export default App;
