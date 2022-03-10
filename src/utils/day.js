require('dotenv').config()

module.exports = () => {
    const timeDifference = new Date().getTime() - (process.env.START_DAY * 1000)
    return Math.ceil(timeDifference / (1000 * 3600 * 24))
}