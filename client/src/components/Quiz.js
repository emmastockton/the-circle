import React, { useContext } from "react";
import { Spinner, UncontrolledAlert } from "reactstrap";

import { RenderContext } from "../contexts/RenderContext";
import RenderButton from "./RenderButton";
import RenderMultiSelect from "./RenderMultiSelect";
import RenderText from "./RenderText";

import "../App.css";

export default function Quiz() {
  const { renderState, dispatch } = useContext(RenderContext);
  const question = renderState.questionMap.get(renderState.currentQuestionId);
  const { isLoading } = renderState;

  const onAnswer = (answer) => {
    dispatch({ type: "AnswerQuestion", answer });
  };

  const props = {
    isLoading,
    question,
    onAnswer,
  };

  return (
    <div>
      {renderState.isLoading && <Spinner color="primary" />}
      {renderState.error && (
        <UncontrolledAlert color="danger">
          Uh oh, that didn't work. Try again later.
        </UncontrolledAlert>
      )}
      {question.type === "button" && <RenderButton {...props} />}
      {question.type === "multiSelect" && <RenderMultiSelect {...props} />}
      {question.type === "text" && <RenderText {...props} />}
    </div>
  );
}
