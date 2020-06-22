import { Button, Input, Alert } from "reactstrap";
import React, { useState } from "react";

const RenderMultiSelect = ({ question, isLoading, onAnswer }) => {
  const [state, setState] = useState({ selected: [] });

  const renderOption = (answer) => {
    return (
      <option key={answer.id} id={answer.id}>
        {answer.text}
      </option>
    );
  };

  const renderAlert = () => {
    console.log("render alert");
    return <Alert>Please select one or more answers from the select.</Alert>;
  };

  const handleChange = (event) => {
    const options = event.target.options;
    const value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].id);
      }
    }

    setState({ selected: value });
  };

  const handleClick = () => {
    if (state.selected.length > 0) {
      onAnswer(state.selected);
    } else {
      setState({ ...state, viewAlert: true });
    }
  };

  return (
    <div>
      <div>
        <b>{question.title}</b>
      </div>
      <div>
        <Input
          type="select"
          name="select"
          id="exampleSelect"
          multiple
          onChange={handleChange}
        >
          {question.answers.map((answer) => {
            return renderOption(answer);
          })}
        </Input>
      </div>

      <div>
        <Button
          block
          color="primary"
          disabled={isLoading}
          onClick={() => handleClick()}
        >
          Continue
        </Button>
      </div>

      {state.viewAlert && renderAlert()}
    </div>
  );
};

export default RenderMultiSelect;
