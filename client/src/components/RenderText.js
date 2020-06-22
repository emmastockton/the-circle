import React, { useContext } from "react";
import { RenderContext } from "../contexts/RenderContext";

const RenderText = () => {
  const { renderState } = useContext(RenderContext);
  const question = renderState.questionMap.get(renderState.currentQuestionId);

  return (
    <div>
      <b>{question.title}</b>
    </div>
  );
};

export default RenderText;
