import React, { useContext } from "react";
import { Container, Spinner, UncontrolledAlert } from "reactstrap";

import { RenderContext } from "../contexts/RenderContext";
import RenderButton from "./RenderButton";
import RenderMultiSelect from "./RenderMultiSelect";
import RenderText from "./RenderText";

import "../App.css";

const QuestionTypes = {
  button: RenderButton,
  multiSelect: RenderMultiSelect,
  text: RenderText,
};

export default function Quiz() {
  const { renderState, dispatch } = useContext(RenderContext);
  const question = renderState.questionMap.get(renderState.currentQuestionId);
  const { isLoading } = renderState;

  const props = {
    isLoading,
    question,
    onAnswer: (answer) => dispatch({ type: "AnswerQuestion", answer }),
  };

  const QuestionTypeComponent = QuestionTypes[question.type];

  if (!QuestionTypeComponent) {
    throw new Error(
      `Unexpected question type of ${
        question.type
      }. Vaild types are: ${Object.keys(QuestionTypes).join(", ")}`
    );
  }

  return (
    <Container>
      {renderState.isLoading && <Spinner color="primary" />}
      {renderState.error && (
        <UncontrolledAlert color="danger">
          Uh oh, that didn't work. Try again later.
        </UncontrolledAlert>
      )}

      <QuestionTypeComponent {...props} />
    </Container>
  );
}
