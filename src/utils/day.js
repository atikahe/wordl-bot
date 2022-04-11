require('dotenv').config();

module.exports = (startDay) => {
  const timeDifference = new Date().getTime() - startDay * 1000;
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};
