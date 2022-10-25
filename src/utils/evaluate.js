const {WHITE, GREEN, YELLOW} = require('./constants');

module.exports = (answersArr, text, index) => {
  const result = [];
  answersArr.forEach((answers) => {
    const answer = answers[index];
    text.forEach((char, i) => {
      if (answer.indexOf(char) === -1) result.push(WHITE);
      else if (answer[i] === char) result.push(GREEN);
      else result.push(YELLOW);
    });
  });
  return result;
};
