const request = require("request")
const cheerio = require("cheerio")

const url = "https://www.espncricinfo.com/records/tournament/batting-most-runs-career/indian-premier-league-2023-15129"

request(url , (error,response,html) => {
    if(error){
        console.log(error)
    }
    else{
        handleHTML(html)
    }
})

const handleHTML = (html) => {
    const $ = cheerio.load(html)
    const arrayData = $(".ds-bg-ui-fill-translucent .ds-text-tight-s.ds-font-regular.ds-text-typo")
    const textData = $(arrayData[0]).text()
    console.log(textData);
}