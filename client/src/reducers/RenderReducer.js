export const getNextQuestionId = (state, { answer }) => {
  const { answerMap, questionMap, currentQuestionId } = state;
  const currentQuestion = questionMap.get(currentQuestionId);

  return currentQuestion.nextQuestionId || answerMap.get(answer).nextQuestionId;
};

export const renderReducer = (state, { answer, type, isLoading }) => {
  switch (type) {
    case "AsyncLoading":
      return {
        ...state,
        isLoading,
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
      const { answers, currentQuestionId } = state;
      const nextQuestionId = getNextQuestionId(state, { answer });

      answers.set(currentQuestionId, answer);

      return {
        ...state,
        currentQuestionId: nextQuestionId,
        answers,
      };
    }
    default:
      return state;
  }
};
