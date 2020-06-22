import { apiEndpoint } from "../config";

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

export const storeData = (state) => {
  const quizData = createResponse(state);
  const apiUrl = `${apiEndpoint}?quizId=${quizData.quizId}`;

  return fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({ quizData }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error();
    }
  });
};
