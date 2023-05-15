const request = require("request")
const cheerio = require("cheerio")

const getScorecard = require("./inningsData.js")

const getMatchesLink = (url) => {
    request(url, (error, response, html) => {
        if (error) {
            console.log(error)
        }
        else {
            getAllMatchLinks(html)
        }
    })
}

const getAllMatchLinks = (html) => {
    const $ = cheerio.load(html)
    const matchElement = $(".ds-grow.ds-px-4").find("a")
    for (let i = 0; i < matchElement.length; i++) {
        const link = $(matchElement[i]).attr("href")  
        const fullLink = `https://www.espncricinfo.com${link}`
        console.log(fullLink);
        getScorecard.getScorecard(fullLink)
    }
}

module.exports = {
    getMatchesLink:getMatchesLink
}