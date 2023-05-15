const request = require("request")
const cheerio = require("cheerio")

const url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/delhi-capitals-vs-royal-challengers-bangalore-50th-match-1359524/ball-by-ball-commentary"

request(url , (error, response, html) => {
    if(error){
        console.log(error.message)
    }
    else{
        // console.log(html)
        getHTML(html)
    }
})

const getHTML = (html) => {
    const $ = cheerio.load(html)
    let arrayData = $(".ds-ml-4 .ci-html-content")
    let dataTEXT = $(arrayData[0]).text()
    let dataHTML = $(arrayData[0]).html()

    console.log(dataTEXT)
    console.log(dataHTML)
}