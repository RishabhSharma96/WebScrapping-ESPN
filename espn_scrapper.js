const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")
const path = require("path")

const getMatchesLink = require("./allMatches.js")

const url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038"

const make_IPL_folder = (filePath) => {
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath)
    }
}

const IPLfolderPath = path.join(__dirname,"IPL2023")
make_IPL_folder(IPLfolderPath)

request(url, (error, response, html) => {
    if (error) {
        console.log(error)
    }
    else {
        getMatchFixturesLink(html)
    }
})

const getMatchFixturesLink = (html) => {

    const $ = cheerio.load(html)
    const linkElement = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2").find("a")
    const link = $(linkElement).attr("href")
    const fullLink = `https://www.espncricinfo.com/${link}`

    console.log(fullLink);

    getMatchesLink.getMatchesLink(fullLink)

}