import { setRender } from "../sharedCode";

export const renderReducer = (state, action) => {
  switch (action.type) {
    case "AsyncLoading":
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case "Error":
      return {
        ...state,
        error: true,
      };
    case "ClearError":
      return {
        ...state,
        error: false,
      };
    case "FinishQuiz": {
      return {
        ...state,
        completed: true,
      };
    }
    case "AnswerQuestion": {
      state.answers.set(state.currentQuestionId, action.update.answer);
      const currentQuestion = state.questionMap.get(state.currentQuestionId);

      // Move to the next question
      state.currentQuestionId = currentQuestion.nextQuestionId
        ? currentQuestion.nextQuestionId
        : state.answerMap.get(action.update.answer).nextQuestionId;

      // call re-render
      const nextQuestion = state.questionMap.get(state.currentQuestionId);
      const nextRender = setRender(nextQuestion);
      action.update.nextPage(nextRender);

      return state;
    }
    default:
      return state;
  }
};
