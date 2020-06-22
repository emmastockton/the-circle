import React, { createContext, useReducer, useEffect } from "react";

import { RenderData } from "../API/RenderData";
import { renderReducer } from "../reducers/RenderReducer";
import { storeData } from "../API/StoreData";

export const RenderContext = createContext();

// The questions are currently hardcoded within
const createQuestionMap = (questions) => {
  return questions.reduce(
    (acc, question) => {
      acc.questions.set(question.id, question);

      if (question.answers) {
        acc.answers = question.answers.reduce((acc2, answer) => {
          return acc2.set(answer.id, answer);
        }, acc.answers);
      }

      return acc;
    },
    { questions: new Map(), answers: new Map() }
  );
};

const createResponse = (state) => {
  return {
    quizId: "" + state.quizId,
    questionAnswers: createAnswerObject(state.answers),
  };
};

const createAnswerObject = (answerMap) => {
  const results = [];

  answerMap.forEach((value, key) => {
    const question = {};
    question.id = "" + key;
    question.answers = Array.isArray(value) ? value : ["" + value];
    results.push(question);
  });

  return results;
};

function dispatchMiddleware(dispatch, state) {
  return (action) => {
    switch (action.type) {
      case "AnswerQuestion": {
        // TODO redo all this
        const nextQuestionId =
          state.questionMap.get(state.currentQuestionId).nextQuestionId ||
          state.answerMap.get(action.update.answer).nextQuestionId;
        const nextQuestion = state.questionMap.get(nextQuestionId);

        if (nextQuestion.type === "text" && !state.completed) {
          dispatch({ type: "AsyncLoading", isLoading: true });
          dispatch({ type: "ClearError" });

          const answers = createResponse(state);

          storeData(answers)
            .then(() => {
              dispatch(action);
              dispatch({ type: "FinishQuiz" });
            })
            .catch(() => {
              dispatch({ type: "Error" });
            })
            .finally(() => {
              dispatch({ type: "AsyncLoading", isLoading: false });
            });
        } else {
          dispatch(action);
        }
        break;
      }
      default:
        return dispatch(action);
    }
  };
}

const RenderContextProvider = (props) => {
  useEffect(() => {
    console.log("We will call out to do a quiz ICL here");
  }, []);

  const questionData = createQuestionMap(RenderData.questions);

  console.log(questionData);

  const [renderState, dispatch] = useReducer(renderReducer, {
    currentQuestionId: 0,
    answers: new Map(),
    questionMap: questionData.questions,
    answerMap: questionData.answers,
    renderButton: true,
    renderDropDown: true,
    completed: false,
    quizId: RenderData.id,
    error: false,
    isLoading: false,
  });

  return (
    <RenderContext.Provider
      value={{
        renderState,
        dispatch: dispatchMiddleware(dispatch, renderState),
      }}
    >
      {props.children}
    </RenderContext.Provider>
  );
};

export default RenderContextProvider;
