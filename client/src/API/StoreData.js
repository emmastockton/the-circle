export const storeData = (quizData) => {
  const apiEndpoint = window.awsAPI.apiEndpoint + "?quizId=" + quizData.quizId;
  return fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(quizData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error();
    }
  });
};
