import React, { createContext, useReducer, useEffect } from "react";

import { RenderData } from "../API/RenderData";
import { getNextQuestionId, renderReducer } from "../reducers/RenderReducer";
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

function dispatchMiddleware(dispatch, state) {
  return (action) => {
    const nextQuestionId = getNextQuestionId(state, action);
    const nextQuestion = state.questionMap.get(nextQuestionId);

    switch (action.type) {
      case "AnswerQuestion": {
        if (nextQuestion.quizEnds !== true || state.completed) {
          dispatch(action);
          break;
        }

        dispatch({ type: "AsyncLoading", isLoading: true });
        dispatch({ type: "ClearError" });

        storeData(state)
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
