const request = require("request")
const cheerio = require("cheerio")

const url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/rajasthan-royals-vs-sunrisers-hyderabad-52nd-match-1359526/full-scorecard"

request(url, (error, response, html) => {
    if (error) {
        console.log(error)
    }
    else {
        handleHTML(html)
    }
})

const handleHTML = (html) => {

    const $ = cheerio.load(html)
    const teamsArray = $(".ds-text-typo.ds-mb-2")

    let winnerTeam = ""
    let winnerTeamIndex = 0;

    if ($(teamsArray[0]).hasClass("ds-opacity-50")) {
        const winnerData = $(teamsArray[1]).find(".ds-text-tight-l.ds-font-bold.ds-text-typo")
        winnerTeam = (winnerData.text())
        winnerTeamIndex = 1
    }
    else {
        const winnerData = $(teamsArray[0]).find(".ds-text-tight-l.ds-font-bold.ds-text-typo")
        winnerTeam = (winnerData.text())
        winnerTeamIndex = 0
    }

    let bowlerDataIndex = 0

    if (winnerTeamIndex == 0) {
        bowlerDataIndex = 3
    }
    else {
        bowlerDataIndex = 1
    }


    const bowlerData = $(".ds-w-full.ds-table.ds-table-md")
    const winnerBowlerData = $(bowlerData[bowlerDataIndex]).find("tr")

    for (let i = 0; i < winnerBowlerData.length; i++) {
        if (i % 2 != 0) {
            const bowler = $(winnerBowlerData[i]).find("td")
            const wickets = $(bowler).find("span")
            let wicketCount = $(wickets).find("strong")

            const bowlerName = $(bowler).find("span.ds-text-typo")

            console.log(`bowler : ${bowlerName.text()} \n wickets : ${wicketCount.text()}`)
        }
    }
}
