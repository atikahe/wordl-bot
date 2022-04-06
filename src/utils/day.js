require('dotenv').config()

module.exports = (start_day) => {
    const timeDifference = new Date().getTime() - (start_day * 1000)
    return Math.ceil(timeDifference / (1000 * 3600 * 24))
}