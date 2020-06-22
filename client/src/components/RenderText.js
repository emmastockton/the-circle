import React from "react";

const RenderText = ({ question }) => {
  return (
    <div>
      <b>{question.title}</b>
    </div>
  );
};

export default RenderText;
