import { Button } from "reactstrap";
import React from "react";

const RenderButton = ({ question, isLoading, onAnswer }) => {
  const AnswerButton = ({ answer }) => {
    return (
      <div key={answer.id}>
        <Button
          disabled={isLoading}
          key={answer.id}
          color="primary"
          onClick={() => {
            onAnswer(answer.id);
          }}
        >
          {answer.text}
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <div>
          <b>{question.title}</b>
        </div>
        <span>
          {question.answers.map((answer) => {
            return <AnswerButton answer={answer} />;
          })}
        </span>
      </div>
    </div>
  );
};

export default RenderButton;
