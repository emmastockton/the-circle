import { Button, Row, Col } from "reactstrap";
import React from "react";

const RenderButton = ({ question, isLoading, onAnswer }) => {
  const AnswerButton = ({ answer }) => {
    return (
      <Row key={answer.id} xs="12" style={{ margin: "10px 0" }}>
        <Col>
          <Button
            disabled={isLoading}
            key={answer.id}
            color="primary"
            block
            onClick={() => {
              onAnswer(answer.id);
            }}
          >
            {answer.text}
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <div>
        <div>
          <b>{question.title}</b>
        </div>

        {question.answers.map((answer) => {
          return <AnswerButton key={`answer-${answer.id}`} answer={answer} />;
        })}
      </div>
    </div>
  );
};

export default RenderButton;
