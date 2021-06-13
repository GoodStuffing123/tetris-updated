import React from "react";

const Lost = () => {
  const play = () => {
    window.location.href = "/play";
  };

  return (
    <>
      <h1 className="lost-title">You lost!</h1>
      <button className="play-button" onClick={play}>
        Play Again
      </button>
    </>
  );
};

export default Lost;
